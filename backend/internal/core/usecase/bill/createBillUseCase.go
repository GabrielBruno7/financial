package bill

import (
	"financial/internal/core/domain/bill"
	"financial/internal/core/port/persistencePort"
)

type CreateBillInput struct {
	Name  string
	Value float64
}

type CreateBillOutput struct {
	Bill    bill.Bill
	Message string
}

type CreateBillUseCase struct {
	repo persistencePort.BillRepositoryInterface
}

func NewCreateBillUseCase(repo persistencePort.BillRepositoryInterface) *CreateBillUseCase {
	return &CreateBillUseCase{repo: repo}
}

func (uc *CreateBillUseCase) Execute(input CreateBillInput) (CreateBillOutput, error) {
	billObj := bill.Bill{
		Name:  input.Name,
		Value: input.Value,
	}

	createdBill, err := uc.repo.Create(billObj)
	if err != nil {
		return CreateBillOutput{}, err
	}

	return CreateBillOutput{
		Bill:    createdBill,
		Message: "Bill created successfully",
	}, nil
}
