#!/bin/bash

# Set variables
DB_URL="postgresql://attenshun_user:bASYTc1PP4so8LEchkE45hRhw8KC01e4@dpg-cquprtij1k6c73djjacg-a.singapore-postgres.render.com/attenshun"
DB_NAME="attenshun"
BACKUP_DIR="/db-backup"
DATE=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# PostgreSQL Backup
PGPASSWORD=bASYTc1PP4so8LEchkE45hRhw8KC01e4 

pg_dump -h dpg-cquprtij1k6c73djjacg-a.singapore-postgres.render.com -U attenshun_user -d $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

echo "Backup completed: $BACKUP_DIR/${DB_NAME}_${DATE}.sql"