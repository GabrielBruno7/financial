package router

import "github.com/gin-gonic/gin"

func registerTransactionRoutes(engine *gin.Engine) {
	transactions := engine.Group("/transactions")
	{
		_ = transactions
		// transactions.POST("", ...)
		// transactions.GET("", ...)
		// transactions.GET("/monthly-summary", ...)
	}
}
