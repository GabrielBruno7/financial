package transaction

type CreateTransactionDTO struct {
	Amount       float64 `json:"amount" binding:"required"`
	Type        string  `json:"type" binding:"required,oneof=income expense"`
}
