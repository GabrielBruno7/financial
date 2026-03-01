package router

import "github.com/gin-gonic/gin"

func RegisterRoutes(engine *gin.Engine) {
	registerHealthcheckRoutes(engine)
	registerTransactionRoutes(engine)
}
