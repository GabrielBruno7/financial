package healthcheck

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HealthCheckResponse struct {
	Status string `json:"status"`
}

func HealthCheck(c *gin.Context) {
	response := HealthCheckResponse{
		Status: "Great changes begin with small steps.",
	}

	c.JSON(http.StatusOK, response)
}
