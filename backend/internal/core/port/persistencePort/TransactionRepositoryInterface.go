package persistencePort

import domain "financial/internal/core/domain/transaction"

type TransactionRepositoryInterface interface {
	Create(transaction domain.Transaction) (domain.Transaction, error)
	List() ([]domain.Transaction, error)
}
