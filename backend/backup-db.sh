#!/usr/bin/env bash
set -e

ENV_FILE="/home/gabriel/financial/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo .env não encontrado em: $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

BACKUP_DIR="/home/gabriel/financial/backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql"

mkdir -p "$BACKUP_DIR"

docker exec -e PGPASSWORD="$DB_PASSWORD" -t financial-postgres \
  pg_dump -U "$DB_USER" -d "$DB_NAME" > "$FILE"

echo "Backup criado em: $FILE"