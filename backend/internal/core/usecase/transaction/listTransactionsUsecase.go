package transaction

import (
	domain "financial/internal/core/domain/transaction"
	"financial/internal/core/port/persistencePort"
	"time"
)

type ListTransactionsUseCase struct {
	repo persistencePort.TransactionRepositoryInterface
}

type ListTransactionsInput struct {
	StartDate string
	EndDate   string
}

type ListTransactionsOutput struct {
	Summary      domain.Summary
	Transactions []domain.Transaction
}

func NewListTransactionsUseCase(repo persistencePort.TransactionRepositoryInterface) *ListTransactionsUseCase {
	return &ListTransactionsUseCase{repo: repo}
}

func (uc *ListTransactionsUseCase) Execute(input ListTransactionsInput) (ListTransactionsOutput, error) {
	startDate, endDate, err := validateDateFilters(input.StartDate, input.EndDate)
	if err != nil {
		return ListTransactionsOutput{}, err
	}

	filter := persistencePort.TransactionListFilter{
		StartDate: startDate,
		EndDate:   endDate,
	}

	transactions, err := uc.repo.List(filter)
	if err != nil {
		return ListTransactionsOutput{}, err
	}

	return ListTransactionsOutput{
		Transactions: transactions,
		Summary:      buildSummary(transactions),
	}, nil
}

func buildSummary(transactions []domain.Transaction) domain.Summary {
	summary := domain.Summary{}

	for _, transaction := range transactions {
		switch transaction.Type {
		case domain.TypeIncome:
			summary.TotalIncome += transaction.Amount
		case domain.TypeExpense:
			summary.TotalExpense += transaction.Amount
		}
	}

	summary.Balance = summary.TotalIncome - summary.TotalExpense

	return summary
}

func validateDateFilters(startStr, endStr string) (*time.Time, *time.Time, error) {
	var startDate *time.Time
	var endDate *time.Time

	now := time.Now()
	location := now.Location()

	if startStr != "" {
		parsedStart, err := time.Parse("2006-01-02", startStr)
		if err != nil {
			return nil, nil, domain.ErrInvalidStartDate
		}
		start := beginningOfDay(parsedStart, location)
		startDate = &start
	}

	if endStr != "" {
		parsedEnd, err := time.Parse("2006-01-02", endStr)
		if err != nil {
			return nil, nil, domain.ErrInvalidEndDate
		}
		end := endOfDay(parsedEnd, location)
		endDate = &end
	}

	if startDate == nil && endDate == nil {
		start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, location)
		end := endOfDay(now, location)
		startDate = &start
		endDate = &end
	}

	if startDate != nil && endDate == nil {
		end := endOfDay(now, location)
		endDate = &end
	}

	if startDate == nil && endDate != nil {
		start := time.Date(endDate.Year(), endDate.Month(), 1, 0, 0, 0, 0, location)
		startDate = &start
	}

	if endDate.Before(*startDate) {
		return nil, nil, domain.ErrInvalidDateRange
	}

	return startDate, endDate, nil
}

func beginningOfDay(t time.Time, location *time.Location) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, location)
}

func endOfDay(t time.Time, location *time.Location) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, int(time.Second-time.Nanosecond), location)
}
