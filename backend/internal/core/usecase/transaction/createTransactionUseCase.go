package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"time"

	"github.com/google/uuid"
)

type CreateTransactionInput struct {
	Amount float64
	Type   string
}

type TransactionRepository interface {
	Create(tx domain.Transaction) (domain.Transaction, error)
}

type CreateTransactionUseCase struct {
	repo TransactionRepository
}

func NewCreateTransactionUseCase(repo TransactionRepository) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{repo: repo}
}

func (uc *CreateTransactionUseCase) Execute(input CreateTransactionInput) (domain.Transaction, error) {
	transaction := domain.Transaction{
		ID:        uuid.NewString(),
		Amount:    input.Amount,
		Type:      domain.Type(input.Type),
		CreatedAt: time.Now(),
	}

	if err := transaction.Validate(); err != nil {
		return transaction, err
	}

	transaction, err := uc.repo.Create(transaction)
	if err != nil {
		return transaction, err
	}

	return transaction, nil
}
