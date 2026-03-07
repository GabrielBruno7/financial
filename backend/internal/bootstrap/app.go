package bootstrap

import (
	"financial/internal/adapters/http/router"
	"financial/internal/adapters/repository/database"

	"github.com/gin-gonic/gin"
)

func NewHTTPServer() (*gin.Engine, error) {
	engine := gin.Default()

	db, err := database.NewPostgresConnection()
	if err != nil {
		return nil, err
	}

	handlers := router.Handlers{
		Transactions: buildTransactionHandlers(db),
		Bills:        buildBillHandlers(db),
	}

	router.RegisterRoutes(engine, handlers)

	return engine, nil
}
