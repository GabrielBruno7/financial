package transaction

type CreateTransactionDTO struct {
	Name   string  `json:"name" binding:"required"`
	Amount float64 `json:"amount" binding:"required"`
	Type   string  `json:"type" binding:"required"`
}
