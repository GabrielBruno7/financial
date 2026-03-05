package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"financial/internal/core/port/persistencePort"
	"time"

	"github.com/google/uuid"
)

type CreateTransactionInput struct {
	Name   string
	Amount float64
	Type   string
}

type CreateTransactionUseCase struct {
	repo persistencePort.TransactionRepositoryInterface
}

func NewCreateTransactionUseCase(repo persistencePort.TransactionRepositoryInterface) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{repo: repo}
}

func (uc *CreateTransactionUseCase) Execute(input CreateTransactionInput) (domain.Transaction, error) {
	transaction := domain.Transaction{
		ID:        uuid.NewString(),
		Name:      input.Name,
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
