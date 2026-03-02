FROM golang:1.25 AS tools

RUN go install github.com/air-verse/air@v1.62 \
 && go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.19

FROM golang:1.25

COPY --from=tools /go/bin/air /go/bin/air
COPY --from=tools /go/bin/migrate /go/bin/migrate

WORKDIR /app

COPY . .

RUN go install github.com/go-delve/delve/cmd/dlv@v1.25
EXPOSE 2345

RUN apt-get update && apt-get install -y postgresql-client curl && rm -rf /var/lib/apt/lists/*

CMD ["go", "run", "./cmd/api/main.go"]
