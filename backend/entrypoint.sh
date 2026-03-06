#!/bin/sh
set -ex

echo "Iniciando entrypoint..."
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_USER=$DB_USER"
echo "DB_NAME=$DB_NAME"

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Aguardando o banco de dados..."
  sleep 2
done

echo "Listando migrations..."
ls -la ./migrations || true

echo "Executando migrations..."
/go/bin/migrate -verbose -path ./migrations -database "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" up

echo "Migrations finalizadas. Iniciando backend."

exec "$@"
