package transaction

import (
	usecaseTransaction "financial/internal/core/usecase/transaction"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateTransactionHandler struct {
	useCase *usecaseTransaction.CreateTransactionUseCase
}

type ErrorResponse struct {
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

func NewCreateTransactionHandler(
	useCase *usecaseTransaction.CreateTransactionUseCase,
) *CreateTransactionHandler {
	return &CreateTransactionHandler{useCase: useCase}
}

func (h *CreateTransactionHandler) Handle(c *gin.Context) {
	var dto CreateTransactionDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Message: "Invalid Request Body",
			Details: err.Error(),
		})
		return
	}

	input := usecaseTransaction.CreateTransactionInput{
		Name:   dto.Name,
		Amount: dto.Amount,
		Type:   dto.Type,
	}

	transaction, err := h.useCase.Execute(input)

	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, ErrorResponse{
			Message: "Failed to create transaction",
			Details: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"transaction": transaction,
		"message":     "Transaction Created Successfully",
	})
}
