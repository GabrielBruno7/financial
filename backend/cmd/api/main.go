package main

import (
	"financial/internal/bootstrap"
	"log"
)

func main() {
	engine, err := bootstrap.NewHTTPServer()
	if err != nil {
		log.Fatalf("failed to bootstrap application: %v", err)
	}

	log.Println("server running on :9000")

	if err := engine.Run(":9000"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
