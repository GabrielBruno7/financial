package transaction

import (
	"errors"
	"time"
)

type Type string

const (
	TypeIncome  Type = "income"
	TypeExpense Type = "expense"
)

var (
	ErrDescriptionRequired    = errors.New("description is required")
	ErrInvalidAmount          = errors.New("amount must be greater than zero")
	ErrInvalidTransactionType = errors.New("transaction type must be income or expense")
	ErrInvalidDate            = errors.New("invalid date")
)

type Transaction struct {
	ID        string
	Amount    float64
	Type      Type
	CreatedAt time.Time
}

func (t Transaction) Validate() error {
	if t.Amount <= 0 {
		return ErrInvalidAmount
	}

	if t.Type != TypeIncome && t.Type != TypeExpense {
		return ErrInvalidTransactionType
	}

	if t.CreatedAt.IsZero() {
		return ErrInvalidDate
	}

	return nil
}
