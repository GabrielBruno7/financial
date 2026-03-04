package transaction

import "time"

type Type string

const (
	TypeIncome  Type = "income"
	TypeExpense Type = "expense"
)

type Transaction struct {
	ID        string
	Amount    float64
	Type      Type
	CreatedAt time.Time
}
