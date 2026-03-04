package router

import "github.com/gin-gonic/gin"

type Handlers struct {
	Transactions TransactionHandlers
}

func RegisterRoutes(engine *gin.Engine, handlers Handlers) {
	registerHealthCheckRoutes(engine)
	registerTransactionRoutes(engine, handlers.Transactions)
}
