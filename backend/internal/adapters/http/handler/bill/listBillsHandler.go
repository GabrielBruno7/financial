package bill

import (
	usecaseBill "financial/internal/core/usecase/bill"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ListBillsHandler struct {
	useCase *usecaseBill.ListBillsUseCase
}

func NewListBillsHandler(
	useCase *usecaseBill.ListBillsUseCase,
) *ListBillsHandler {
	return &ListBillsHandler{useCase: useCase}
}

func (h *ListBillsHandler) Handle(c *gin.Context) {
	billsOutput, err := h.useCase.Execute()
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Failed to list bills",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bills": billsOutput.Bills,
	})
}
