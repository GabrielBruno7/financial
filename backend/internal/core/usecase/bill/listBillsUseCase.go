package bill

import (
	"financial/internal/core/domain/bill"
	"financial/internal/core/port/persistencePort"
)

type ListBillsUseCase struct {
	repo persistencePort.BillRepositoryInterface
}

type ListBillsOutput struct {
	Bills []bill.Bill
}

func NewListBillsUseCase(repo persistencePort.BillRepositoryInterface) *ListBillsUseCase {
	return &ListBillsUseCase{repo: repo}
}

func (uc *ListBillsUseCase) Execute() (ListBillsOutput, error) {
	billsList, err := uc.repo.List()
	if err != nil {
		return ListBillsOutput{}, err
	}

	return ListBillsOutput{Bills: billsList}, nil
}
