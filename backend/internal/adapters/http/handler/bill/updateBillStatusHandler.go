package bill

import (
	usecaseBill "financial/internal/core/usecase/bill"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UpdateBillStatusHandler struct {
	useCase *usecaseBill.UpdateBillStatusUseCase
}

func NewUpdateBillStatusHandler(
	useCase *usecaseBill.UpdateBillStatusUseCase,
) *UpdateBillStatusHandler {
	return &UpdateBillStatusHandler{useCase: useCase}
}

func (h *UpdateBillStatusHandler) Handle(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Message: "Invalid bill id",
			Details: "route parameter 'id' is required",
		})
		return
	}

	var dto UpdateBillStatusDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Message: "Invalid Request Body",
			Details: err.Error(),
		})
		return
	}

	input := usecaseBill.UpdateBillStatusInput{
		ID:     id,
		IsPaid: dto.IsPaid,
	}

	billOutput, err := h.useCase.Execute(input)

	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, ErrorResponse{
			Message: "Failed to update bill status",
			Details: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bill":    billOutput.Bill,
		"message": billOutput.Message,
	})
}
