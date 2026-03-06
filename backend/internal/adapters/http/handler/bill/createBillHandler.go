package bill

import (
    "financial/internal/core/usecase/bill"
    "net/http"
    "github.com/gin-gonic/gin"
)

type CreateBillHandler struct {
    useCase *bill.CreateBillUseCase
}

type ErrorResponse struct {
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

func NewCreateBillHandler(useCase *bill.CreateBillUseCase) *CreateBillHandler {
    return &CreateBillHandler{useCase: useCase}
}

func (h *CreateBillHandler) Handle(c *gin.Context) {
    var dto CreateBillDTO

    if err := c.ShouldBindJSON(&dto); err != nil {
        c.JSON(http.StatusBadRequest, ErrorResponse{
            Message: "Invalid Request Body",
            Details: err.Error(),
        })
        return
    }

    input := bill.CreateBillInput{
        Name:  dto.Name,
        Value: dto.Value,
    }

    billOutput, err := h.useCase.Execute(input)
    if err != nil {
        c.JSON(http.StatusUnprocessableEntity, ErrorResponse{
            Message: "Failed to create bill",
            Details: err.Error(),
        })
        return
    }
    c.JSON(http.StatusCreated, gin.H{
        "bill":    billOutput.Bill,
        "message": billOutput.Message,
    })
}