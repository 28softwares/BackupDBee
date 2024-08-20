#!/bin/bash
# Scripts that dumps 10 rows from each table in a database.

DB_NAME="location"
DB_USER="root"
DB_PASS="iamsohappy"
OUTPUT_FILE="limited_dump.sql"

# Clear output file before writing
> $OUTPUT_FILE

# Get list of tables
tables=$(mysql -u $DB_USER -p$DB_PASS -D $DB_NAME -e "SHOW TABLES;" | awk '{ print $1}' | grep -v '^Tables')

# Dump 10 rows from each table
for table in $tables; do
    echo "Dumping table: $table"
mysqldump -u $DB_USER -p$DB_PASS --no-create-info --skip-lock-tables --compact --quick \
    --where="TRUE LIMIT 10" "$DB_NAME" "$table" >> "$OUTPUT_FILE"
done

