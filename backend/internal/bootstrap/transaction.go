package bootstrap

import (
	transactionHandler "financial/internal/adapters/http/handler/transaction"
	"financial/internal/adapters/http/router"
	transactionRepository "financial/internal/adapters/repository/transaction"
	usecaseTransaction "financial/internal/core/usecase/transaction"

	"gorm.io/gorm"
)

func buildTransactionHandlers(db *gorm.DB) router.TransactionHandlers {
	repo := transactionRepository.NewTransactionRepository(db)

	createUseCase := usecaseTransaction.NewCreateTransactionUseCase(repo)
	listUseCase := usecaseTransaction.NewListTransactionsUseCase(repo)

	return router.TransactionHandlers{
		Create: transactionHandler.NewCreateTransactionHandler(createUseCase),
		List:   transactionHandler.NewListTransactionsHandler(listUseCase),
	}
}