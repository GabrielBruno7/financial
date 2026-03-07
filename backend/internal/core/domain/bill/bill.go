package bill

import (
	"errors"
	"time"
)

type Bill struct {
	ID        string
	Name      string
	Amount    float64
	IsPaid    bool
	CreatedAt time.Time
}

var (
	ErrNameRequired           = errors.New("Name is required")
	ErrNameTooLong            = errors.New("Name must be less than 256 characters")
	ErrInvalidAmount          = errors.New("Amount must be greater than zero")
	ErrInvalidIsPaid          = errors.New("Is Paid must be true or false")
	ErrInvalidDate            = errors.New("Invalid date")
)

func (b Bill) Validate() error {
	if b.Name == "" {
		return ErrNameRequired
	}

	if b.Name != "" && len(b.Name) > 255 {
		return ErrNameTooLong
	}

	if b.Amount <= 0 {
		return ErrInvalidAmount
	}

	if b.IsPaid != true && b.IsPaid != false {
		return ErrInvalidIsPaid
	}

	if b.CreatedAt.IsZero() {
		return ErrInvalidDate
	}

	return nil
}
