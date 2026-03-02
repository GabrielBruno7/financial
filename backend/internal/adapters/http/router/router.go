package router

import "github.com/gin-gonic/gin"

func RegisterRoutes(engine *gin.Engine) {
	registerHealthCheckRoutes(engine)
	registerTransactionRoutes(engine)
}
