package persistencePort

import (
	domain "financial/internal/core/domain/transaction"
	"time"
)

type TransactionListFilter struct {
	StartDate *time.Time
	EndDate   *time.Time
}

type TransactionRepositoryInterface interface {
	Create(transaction domain.Transaction) (domain.Transaction, error)
	List(filters TransactionListFilter) ([]domain.Transaction, error)
}
