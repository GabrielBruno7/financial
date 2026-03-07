package bill

import (
	domain "financial/internal/core/domain/bill"
	"financial/package/debug"

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

	debug.Print("Creating bill", bill)

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
