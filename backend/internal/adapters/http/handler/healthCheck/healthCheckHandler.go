package healthcheck

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HealthCheckResponse struct {
	Status string `json:"status"`
	Message string `json:"message,omitempty"`
}

func HealthCheck(c *gin.Context) {
	response := HealthCheckResponse{
		Status:  "ok",
		Message: "Great changes begin with small steps.",
	}

	c.JSON(http.StatusOK, response)
}
