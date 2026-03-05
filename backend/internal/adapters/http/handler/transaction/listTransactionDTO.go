package transaction

type ListTransactionDTO struct {
	StartDate string  `form:"start_date"`
	EndDate   string  `form:"end_date"`
}
