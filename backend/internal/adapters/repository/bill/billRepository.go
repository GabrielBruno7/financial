package bill

import (
	domain "financial/internal/core/domain/bill"

	"gorm.io/gorm"
)

type BillRepository struct {
	db *gorm.DB
}

func NewBillRepository(db *gorm.DB) *BillRepository {
	return &BillRepository{db: db}
}

func (r *BillRepository) Create(bill domain.Bill) (domain.Bill, error) {
	query := `
		INSERT INTO bills (
			id,
			name,
			amount,
			created_at
		)
		VALUES ($1, $2, $3, $4)
	`

	if err := r.db.Exec(query,
		bill.ID,
		bill.Name,
		bill.Amount,
		bill.CreatedAt,
	).Error; err != nil {
		return domain.Bill{}, err
	}

	return bill, nil
}

func (r *BillRepository) List() ([]domain.Bill, error) {
	var models []BillModel

	query := `
		SELECT id, name, amount, is_paid, created_at
		FROM bills
		ORDER BY created_at DESC
	`

	if err := r.db.Raw(query).Scan(&models).Error; err != nil {
		return nil, err
	}

	bills := make([]domain.Bill, len(models))
	for i, model := range models {
		bills[i] = domain.Bill{
			ID:        model.ID,
			Name:      model.Name,
			Amount:    model.Amount,
			IsPaid:    model.IsPaid,
			CreatedAt: model.CreatedAt,
		}
	}

	return bills, nil
}

func (r *BillRepository) LoadBillByID(bill domain.Bill) (domain.Bill, error) {
	var model BillModel

	query := `
		SELECT id, name, amount, is_paid, created_at, updated_at
		FROM bills
		WHERE id = $1
		LIMIT 1
	`

	if err := r.db.Raw(query, bill.ID).Scan(&model).Error; err != nil {
		return domain.Bill{}, err
	}

	if model.ID == "" {
		return domain.Bill{}, gorm.ErrRecordNotFound
	}

	return domain.Bill{
		ID:        model.ID,
		Name:      model.Name,
		Amount:    model.Amount,
		IsPaid:    model.IsPaid,
		CreatedAt: model.CreatedAt,
		UpdatedAt: model.UpdatedAt,
	}, nil
}

func (r *BillRepository) UpdateStatus(bill domain.Bill) (domain.Bill, error) {
	query := `
		UPDATE bills
		SET is_paid = $1,
		    updated_at = NOW()
		WHERE id = $2
	`

	if err := r.db.Exec(query, bill.IsPaid, bill.ID).Error; err != nil {
		return domain.Bill{}, err
	}

	var model BillModel

	selectQuery := `
		SELECT id, name, amount, is_paid, created_at, updated_at
		FROM bills
		WHERE id = $1
	`

	if err := r.db.Raw(selectQuery, bill.ID).Scan(&model).Error; err != nil {
		return domain.Bill{}, err
	}

	return domain.Bill{
		ID:        model.ID,
		Name:      model.Name,
		Amount:    model.Amount,
		IsPaid:    model.IsPaid,
		CreatedAt: model.CreatedAt,
		UpdatedAt: model.UpdatedAt,
	}, nil
}
