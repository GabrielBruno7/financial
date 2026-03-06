package bill

import (
	"financial/internal/core/usecase/bill"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ListBillsHandler struct {
	useCase *bill.ListBillsUseCase
}

func NewListBillsHandler(useCase *bill.ListBillsUseCase) *ListBillsHandler {
	return &ListBillsHandler{useCase: useCase}
}

func (h *ListBillsHandler) Handle(c *gin.Context) {
	output, err := h.useCase.Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to list bills",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bills": output.Bills,
	})
}
