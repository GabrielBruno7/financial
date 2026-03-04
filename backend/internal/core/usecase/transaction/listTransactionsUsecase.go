package transaction

import (
	domain "financial/internal/core/domain/transaction"
)

type ListTransactionsUseCase struct {
	repo TransactionRepository
}

func NewListTransactionsUseCase(repo TransactionRepository) *ListTransactionsUseCase {
	return &ListTransactionsUseCase{repo: repo}
}

func (uc *ListTransactionsUseCase) Execute() ([]domain.Transaction, error) {
	transactions, err := uc.repo.List()
	if err != nil {
		return nil, err
	}

	return transactions, nil
}
