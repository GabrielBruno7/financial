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
	ErrNameRequired           = errors.New("Name is required")
	ErrInvalidStartDate       = errors.New("Invalid start date format, expected YYYY-MM-DD")
	ErrInvalidEndDate         = errors.New("Invalid end date format, expected YYYY-MM-DD")
	ErrInvalidDateRange       = errors.New("Start date must be before end date")
	ErrNameTooLong            = errors.New("Name must be less than 256 characters")
	ErrInvalidAmount          = errors.New("Amount must be greater than zero")
	ErrInvalidTransactionType = errors.New("Transaction type must be income or expense")
	ErrInvalidDate            = errors.New("Invalid date")
)

type Transaction struct {
	ID        string
	Name      string
	Amount    float64
	Type      Type
	CreatedAt time.Time
}

func (t Transaction) Validate() error {
	if t.Name == "" {
		return ErrNameRequired
	}

	if t.Name != "" && len(t.Name) > 255 {
		return ErrNameTooLong
	}

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
