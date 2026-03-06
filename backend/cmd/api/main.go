package main

import (
	billHandler "financial/internal/adapters/http/handler/bill"
	transactionHandler "financial/internal/adapters/http/handler/transaction"
	"financial/internal/adapters/http/router"
	billRepository "financial/internal/adapters/repository/bill"
	"financial/internal/adapters/repository/database"
	transactionRepository "financial/internal/adapters/repository/transaction"
	usecaseBill "financial/internal/core/usecase/bill"
	usecaseTransaction "financial/internal/core/usecase/transaction"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()

	db, err := database.NewPostgresConnection()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	transactionRepository := transactionRepository.NewTransactionRepository(db)
	createTransactionUseCase := usecaseTransaction.NewCreateTransactionUseCase(transactionRepository)
	createTransactionHandler := transactionHandler.NewCreateTransactionHandler(createTransactionUseCase)

	listTransactionsUseCase := usecaseTransaction.NewListTransactionsUseCase(transactionRepository)
	listTransactionsHandler := transactionHandler.NewListTransactionsHandler(listTransactionsUseCase)

	billRepository := billRepository.NewBillRepository(db)
	createBillUseCase := usecaseBill.NewCreateBillUseCase(billRepository)
	createBillHandler := billHandler.NewCreateBillHandler(createBillUseCase)

	listBillsUseCase := usecaseBill.NewListBillsUseCase(billRepository)
	listBillsHandler := billHandler.NewListBillsHandler(listBillsUseCase)

	handlers := router.Handlers{
		Transactions: router.TransactionHandlers{
			Create: createTransactionHandler,
			List:   listTransactionsHandler,
		},
		Bills: router.BillHandlers{
			Create: createBillHandler,
			List:   listBillsHandler,
		},
	}

	router.RegisterRoutes(engine, handlers)

	log.Println("server running on :9000")

	if err := engine.Run(":9000"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
