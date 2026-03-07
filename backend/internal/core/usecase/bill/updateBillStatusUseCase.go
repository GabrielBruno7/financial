package bill

import (
	domain "financial/internal/core/domain/bill"
	"financial/internal/core/port/persistencePort"
	"time"
)

type UpdateBillStatusInput struct {
	ID     string
	IsPaid bool
}

type UpdateBillStatusOutput struct {
	Bill    domain.Bill
	Message string
}

type UpdateBillStatusUseCase struct {
	repo persistencePort.BillRepositoryInterface
}

func NewUpdateBillStatusUseCase(repo persistencePort.BillRepositoryInterface) *UpdateBillStatusUseCase {
	return &UpdateBillStatusUseCase{repo: repo}
}

func (uc *UpdateBillStatusUseCase) Execute(input UpdateBillStatusInput) (UpdateBillStatusOutput, error) {
	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		return UpdateBillStatusOutput{}, err
	}

	updatedAt := time.Now().In(loc)

	bill := domain.Bill{
		ID: input.ID,
	}

	bill, err = uc.repo.LoadBillByID(bill)
	if err != nil {
		return UpdateBillStatusOutput{}, err
	}

	bill.IsPaid = input.IsPaid
	bill.UpdatedAt = &updatedAt

	if err := bill.Validate(); err != nil {
		return UpdateBillStatusOutput{}, err
	}

	bill, err = uc.repo.UpdateStatus(bill)
	if err != nil {
		return UpdateBillStatusOutput{}, err
	}

	return UpdateBillStatusOutput{
		Bill:    bill,
		Message: "Bill updated successfully",
	}, nil
}
