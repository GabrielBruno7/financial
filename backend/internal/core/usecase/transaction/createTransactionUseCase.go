package transaction

import (
	"errors"
	domain "financial/internal/core/domain/transaction"
	"time"

	"github.com/google/uuid"
)

var (
	ErrDescriptionRequired    = errors.New("description is required")
	ErrInvalidAmount          = errors.New("amount must be greater than zero")
	ErrInvalidTransactionType = errors.New("transaction type must be income or expense")
	ErrInvalidDate            = errors.New("invalid date")
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
	tx := domain.Transaction{
		ID:        uuid.NewString(),
		Amount:    input.Amount,
		Type:      domain.Type(input.Type),
		CreatedAt: time.Now(),
	}

	created, err := uc.repo.Create(tx)
	if err != nil {
		return domain.Transaction{}, err
	}

	return created, nil
}
