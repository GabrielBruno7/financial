package router

import "github.com/gin-gonic/gin"

type Handlers struct {
	Transactions TransactionHandlers
	Bills        BillHandlers
}

func RegisterRoutes(engine *gin.Engine, handlers Handlers) {
	registerHealthCheckRoutes(engine)
	registerBillRoutes(engine, handlers.Bills)
	registerTransactionRoutes(engine, handlers.Transactions)
}
