package router

import (
	billHandler "financial/internal/adapters/http/handler/bill"

	"github.com/gin-gonic/gin"
)

type BillHandlers struct {
	Create *billHandler.CreateBillHandler
	List   *billHandler.ListBillsHandler
}

func registerBillRoutes(engine *gin.Engine, handlers BillHandlers) {
	bills := engine.Group("/bills")
	{
		bills.POST("", handlers.Create.Handle)
		bills.GET("", handlers.List.Handle)
	}
}
