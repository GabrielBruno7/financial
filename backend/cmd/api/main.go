package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"financial/internal/adapters/http/router"
)

func main() {
	engine := gin.Default()

	router.RegisterRoutes(engine)

	log.Println("server running on :9000")

	if err := engine.Run(":9000"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
