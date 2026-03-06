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
	query := `INSERT INTO bills (name, value) VALUES (?, ?)`
	if err := r.db.Exec(query, bill.Name, bill.Value).Error; err != nil {
		return domain.Bill{}, err
	}

	return bill, nil
}

func (r *BillRepository) List() ([]domain.Bill, error) {
	var bills []domain.Bill
	if err := r.db.Raw("SELECT name, value FROM bills").Scan(&bills).Error; err != nil {
		return nil, err
	}

	return bills, nil
}
