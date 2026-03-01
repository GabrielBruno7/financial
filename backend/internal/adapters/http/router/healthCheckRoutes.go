package router

import (
	"github.com/gin-gonic/gin"

	healthcheck "financial/internal/adapters/http/handler/healthCheck"
)

func registerHealthcheckRoutes(engine *gin.Engine) {
	engine.GET("/health", healthcheck.HealthCheck)
}