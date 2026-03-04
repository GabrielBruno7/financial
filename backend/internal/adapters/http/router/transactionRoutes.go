package router

import (
	transactionHandler "financial/internal/adapters/http/handler/transaction"

	"github.com/gin-gonic/gin"
)

type TransactionHandlers struct {
	Create *transactionHandler.CreateTransactionHandler
	List   *transactionHandler.ListTransactionsHandler
}

func registerTransactionRoutes(engine *gin.Engine, handlers TransactionHandlers) {
	transactions := engine.Group("/transactions")
	{
		transactions.POST("", handlers.Create.Handle)
		transactions.GET("", handlers.List.Handle)
	}
}
