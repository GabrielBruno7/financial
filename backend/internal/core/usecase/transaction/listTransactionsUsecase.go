package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"financial/internal/core/port/persistencePort"
)

type ListTransactionsUseCase struct {
	repo persistencePort.TransactionRepositoryInterface
}

func NewListTransactionsUseCase(repo persistencePort.TransactionRepositoryInterface) *ListTransactionsUseCase {
	return &ListTransactionsUseCase{repo: repo}
}

func (uc *ListTransactionsUseCase) Execute() ([]domain.Transaction, error) {
	transactions, err := uc.repo.List()
	if err != nil {
		return nil, err
	}

	return transactions, nil
}
