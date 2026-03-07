package bootstrap

import (
	billHandler "financial/internal/adapters/http/handler/bill"
	"financial/internal/adapters/http/router"
	billRepository "financial/internal/adapters/repository/bill"
	usecaseBill "financial/internal/core/usecase/bill"

	"gorm.io/gorm"
)

func buildBillHandlers(db *gorm.DB) router.BillHandlers {
	repo := billRepository.NewBillRepository(db)

	createUseCase := usecaseBill.NewCreateBillUseCase(repo)
	listUseCase := usecaseBill.NewListBillsUseCase(repo)

	updateStatusUseCase := usecaseBill.NewUpdateBillStatusUseCase(repo)
	updateStatusHandler := billHandler.NewUpdateBillStatusHandler(updateStatusUseCase)

	return router.BillHandlers{
		Create:       billHandler.NewCreateBillHandler(createUseCase),
		List:         billHandler.NewListBillsHandler(listUseCase),
		UpdateStatus: updateStatusHandler,
	}
}
