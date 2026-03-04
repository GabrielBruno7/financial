package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(tx domain.Transaction) (domain.Transaction, error) {
	model := TransactionModel{
		ID:        tx.ID,
		Amount:    tx.Amount,
		Type:      string(tx.Type),
		CreatedAt: tx.CreatedAt,
	}

	if err := r.db.Create(&model).Error; err != nil {
		return domain.Transaction{}, err
	}

	return tx, nil
}
