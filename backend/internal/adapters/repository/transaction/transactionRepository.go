package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"financial/internal/core/port/persistencePort"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(transaction domain.Transaction) (domain.Transaction, error) {
	query := `
		INSERT INTO transactions (
			id,
			name,
			amount,
			type,
			created_at
		)
		VALUES (?, ?, ?, ?, ?)
	`

	if err := r.db.Exec(query,
		transaction.ID,
		transaction.Name,
		transaction.Amount,
		string(transaction.Type),
		transaction.CreatedAt,
	).Error; err != nil {
		return domain.Transaction{}, err
	}

	return transaction, nil
}

func (r *TransactionRepository) List(
	filter persistencePort.TransactionListFilter,
) ([]domain.Transaction, error) {
	var models []TransactionModel

	query := `
		       SELECT id, name, amount, type, created_at
		       FROM transactions
		       WHERE created_at BETWEEN ? AND ?
		       ORDER BY created_at DESC
	       `

	if err := r.db.Raw(query, filter.StartDate, filter.EndDate).Scan(&models).Error; err != nil {
		return nil, err
	}

	transactions := make([]domain.Transaction, len(models))
	for i, model := range models {
		transactions[i] = domain.Transaction{
			ID:        model.ID,
			Name:      model.Name,
			Amount:    model.Amount,
			Type:      domain.Type(model.Type),
			CreatedAt: model.CreatedAt,
		}
	}

	return transactions, nil
}
