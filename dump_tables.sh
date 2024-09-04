#!/bin/bash

# Function to display help message
show_help() {
    echo "Usage: $0 -d <database_name> -u <username> -p <password> -o <output_file>"
    echo ""
    echo "Options:"
    echo "  -d  Database name"
    echo "  -u  MySQL username"
    echo "  -p  MySQL password"
    echo "  -o  Output file (optional, default: limited_dump.sql)"
    echo "  -h  Display this help message"
}

# Default output file
OUTPUT_FILE="limited_dump.sql"

# Parse command-line arguments
while getopts ":d:u:p:o:h" opt; do
    case ${opt} in
        d )
            DB_NAME=$OPTARG
            ;;
        u )
            DB_USER=$OPTARG
            ;;
        p )
            DB_PASS=$OPTARG
            ;;
        o )
            OUTPUT_FILE=$OPTARG
            ;;
        h )
            show_help
            exit 0
            ;;
        \? )
            echo "Invalid option: -$OPTARG" >&2
            show_help
            exit 1
            ;;
        : )
            echo "Option -$OPTARG requires an argument." >&2
            show_help
            exit 1
            ;;
    esac
done

# Check if required arguments are provided
if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ]; then
    echo "Error: Database name, username, and password are required."
    show_help
    exit 1
fi

# Clear output file before writing
> "$OUTPUT_FILE"

# Get list of tables
tables=$(mysql -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "SHOW TABLES;" | awk '{ print $1}' | grep -v '^Tables')

# Dump 10 rows from each table
for table in $tables; do
    echo "Dumping table: $table"
    mysqldump -u "$DB_USER" -p"$DB_PASS" --no-create-info --skip-lock-tables --compact --quick \
        --where="TRUE LIMIT 10" "$DB_NAME" "$table" >> "$OUTPUT_FILE"
done

echo "Dump completed. Output saved to $OUTPUT_FILE."
