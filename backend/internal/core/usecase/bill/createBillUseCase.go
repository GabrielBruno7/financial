package bill

import (
	domain "financial/internal/core/domain/bill"
	"financial/internal/core/port/persistencePort"
	"time"

	"github.com/google/uuid"
)

type CreateBillInput struct {
	Name   string
	Amount float64
}

type CreateBillOutput struct {
	Bill    domain.Bill
	Message string
}

type CreateBillUseCase struct {
	repo persistencePort.BillRepositoryInterface
}

func NewCreateBillUseCase(repo persistencePort.BillRepositoryInterface) *CreateBillUseCase {
	return &CreateBillUseCase{repo: repo}
}

func (uc *CreateBillUseCase) Execute(input CreateBillInput) (CreateBillOutput, error) {
	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		return CreateBillOutput{}, err
	}

	bill := domain.Bill{
		ID:        uuid.NewString(),
		Name:      input.Name,
		Amount:    input.Amount,
		CreatedAt: time.Now().In(loc),
	}

	if err := bill.Validate(); err != nil {
		return CreateBillOutput{}, err
	}

	bill, err = uc.repo.Create(bill)
	if err != nil {
		return CreateBillOutput{}, err
	}

	return CreateBillOutput{
		Bill:    bill,
		Message: "Bill created successfully",
	}, nil
}
