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

type CreateTransactionOutput struct {
	Transaction domain.Transaction
	Message     string
}

type CreateTransactionUseCase struct {
	repo persistencePort.TransactionRepositoryInterface
}

func NewCreateTransactionUseCase(repo persistencePort.TransactionRepositoryInterface) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{repo: repo}
}

func (uc *CreateTransactionUseCase) Execute(input CreateTransactionInput) (CreateTransactionOutput, error) {
	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		return CreateTransactionOutput{}, err
	}

	transaction := domain.Transaction{
		ID:        uuid.NewString(),
		Name:      input.Name,
		Amount:    input.Amount,
		Type:      domain.Type(input.Type),
		CreatedAt: time.Now().In(loc),
	}

	if err := transaction.Validate(); err != nil {
		return CreateTransactionOutput{}, err
	}

	transaction, err = uc.repo.Create(transaction)
	if err != nil {
		return CreateTransactionOutput{}, err
	}

	return CreateTransactionOutput{
		Transaction: transaction,
		Message:     "Transaction created successfully",
	}, nil
}
