package transaction

import (
	usecaseTransaction "financial/internal/core/usecase/transaction"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ListTransactionsHandler struct {
	useCase *usecaseTransaction.ListTransactionsUseCase
}

func NewListTransactionsHandler(
	useCase *usecaseTransaction.ListTransactionsUseCase,
) *ListTransactionsHandler {
	return &ListTransactionsHandler{useCase: useCase}
}

func (h *ListTransactionsHandler) Handle(c *gin.Context) {
	transactions, err := h.useCase.Execute()
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Failed to list transactions",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transactions": transactions,
	})
}
