package main

import (
	transactionHandler "financial/internal/adapters/http/handler/transaction"
	"financial/internal/adapters/http/router"
	"financial/internal/adapters/repository/database"
	transactionRepository "financial/internal/adapters/repository/transaction"
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

	handlers := router.Handlers{
		Transactions: router.TransactionHandlers{
			Create: createTransactionHandler,
		},
	}

	router.RegisterRoutes(engine, handlers)

	log.Println("server running on :9000")

	if err := engine.Run(":9000"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
