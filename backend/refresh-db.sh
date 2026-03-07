#!/usr/bin/env bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Uso:"
  echo "   ./refresh-db.sh <password> up"
  echo "   ./refresh-db.sh <password> reset"
  exit 1
fi

PASSWORD=$1
ACTION=$2

DATABASE_URL="postgres://financial_user:$PASSWORD@postgres:5432/financial_db?sslmode=disable"

if [ "$ACTION" = "up" ]; then
  echo "▶ Aplicando migrations sem apagar dados..."
  docker compose run --rm --entrypoint="" backend sh -c "
    migrate -path ./migrations -database '$DATABASE_URL' up
  "
  echo "✅ Migrations aplicadas com sucesso."
  exit 0
fi

if [ "$ACTION" = "reset" ]; then
  echo "⚠ Isso vai apagar TODOS os dados do banco financial_db."
  read -p 'Digite RESET para confirmar: ' CONFIRM

  if [ "$CONFIRM" != "RESET" ]; then
    echo "❌ Operação cancelada."
    exit 1
  fi

  echo "▶ Resetando banco..."
  docker compose run --rm --entrypoint="" backend sh -c "
    migrate -path ./migrations -database '$DATABASE_URL' drop -f &&
    migrate -path ./migrations -database '$DATABASE_URL' up
  "
  echo "✅ Banco recriado com sucesso."
  exit 0
fi

echo "❌ Ação inválida: $ACTION"
echo "Use: up ou reset"
exit 1