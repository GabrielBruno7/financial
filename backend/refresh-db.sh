set -e

if [ -z "$1" ]; then
    echo "❌ Uso: ./refresh-db.sh <password>"
    exit 1
fi

PASSWORD=$1

docker compose run --rm --entrypoint="" backend sh -c "
migrate -path ./migrations -database 'postgres://financial_user:$PASSWORD@postgres:5432/financial_db?sslmode=disable' drop -f && 
migrate -path ./migrations -database 'postgres://financial_user:$PASSWORD@postgres:5432/financial_db?sslmode=disable' up
"
