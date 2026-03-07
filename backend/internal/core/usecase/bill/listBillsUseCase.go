package bill

import (
	domain "financial/internal/core/domain/bill"
	"financial/internal/core/port/persistencePort"
)

type ListBillsUseCase struct {
	repo persistencePort.BillRepositoryInterface
}

type ListBillsInput struct {
	StartDate string
	EndDate   string
}

type ListBillsOutput struct {
	Bills []domain.Bill
}

func NewListBillsUseCase(repo persistencePort.BillRepositoryInterface) *ListBillsUseCase {
	return &ListBillsUseCase{repo: repo}
}

func (uc *ListBillsUseCase) Execute() (ListBillsOutput, error) {
	bills, err := uc.repo.List()
	if err != nil {
		return ListBillsOutput{}, err
	}

	return ListBillsOutput{
		Bills: bills,
	}, nil
}
