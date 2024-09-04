#!/bin/bash

if ! command -v zip &> /dev/null
then
    echo "zip command not found"
    exit 1
fi


if ! command -v pg_dump &> /dev/null
then 
    echo "pg_dump command not found!"
    exit 1
fi


if ! command -v mysqldump &> /dev/null
then 
    echo "mysqldump command not found!"
    exit 1
fi

if ! command -v pnpm &> /dev/null
then 
    echo "pnpm command not found!"
    exit 1
fi

if ! command -v node &> /dev/null
then 
    echo "node command not found!"
    exit 1
fi


# Function to prompt user input with a default value
prompt_input() {
    read -p "$1 [$2]: " input
    echo "${input:-$2}"
}

# Function to prompt user input with a list of options
prompt_option() {
    local options=("$@")

    select opt in "${options[@]}"; do
        if [ -n "$opt" ]; then
            echo "$opt"
            break
        else
            echo "Invalid option. Please choose a number between 1 and ${#options[@]}."
        fi
    done
}

# Choose backup option
echo "Please choose a backup option:"
BACKUP_DEST=$(prompt_option "GMAIL" "S3_BUCKET")

# Collect details based on the chosen backup option
if [[ $BACKUP_DEST == "GMAIL" ]]; then
    MAIL_USER=$(prompt_input "Enter MAIL_USER")
    MAIL_PASSWORD=$(prompt_input "Enter MAIL_PASSWORD")
elif [[ $BACKUP_DEST == "S3_BUCKET" ]]; then
    AWS_ACCESS_KEY_ID=$(prompt_input "Enter AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY=$(prompt_input "Enter AWS_SECRET_ACCESS_KEY")
    AWS_S3_BUCKET_NAME=$(prompt_input "Enter AWS_S3_BUCKET_NAME")
    AWS_REGION=$(prompt_input "Enter AWS_REGION")
else
    echo "Invalid backup option selected."
    exit 1
fi


# Choose backup notification
echo "Please choose a backup notification option:"
BACKUP_NOTIFICATION=$(prompt_option "SLACK" "DISCORD")

# Collect notification details based on the chosen notification option
if [[ $BACKUP_NOTIFICATION == "SLACK" ]]; then
    SLACK_WEBHOOK_URL=$(prompt_input "Enter SLACK_WEBHOOK_URL")
elif [[ $BACKUP_NOTIFICATION == "DISCORD" ]]; then
    DISCORD_WEBHOOK_URL=$(prompt_input "Enter DISCORD_WEBHOOK_URL")
else
    echo "Invalid notification option selected."
    exit 1
fi


POSTGRES_DB_HOST=$(prompt_input "Enter Postgres DB host" "127.0.0.1")
POSTGRES_DB_NAME=$(prompt_input "Enter Postgres DB name" "postgres")
POSTGRES_DB_USER=$(prompt_input "Enter Postgres DB user" "postgres")
POSTGRES_DB_PASSWORD=$(prompt_input "Enter Postgres DB password" "postgres")

MYSQL_HOST=$(prompt_input "Enter MySQL host" "127.0.0.1")
MYSQL_DB_NAME=$(prompt_input "Enter MySQL DB name" "mysqldb")
MYSQL_DB_USER=$(prompt_input "Enter MySQL DB user" "root")
MYSQL_DB_PASSWORD=$(prompt_input "Enter MySQL DB password" "my-secret-pw")


# Create the .env file
cat <<EOF > .env
#MAIL
MAIL_USER='$MAIL_USER'
MAIL_PASSWORD='$MAIL_PASSWORD'

#BACKUP_CONFIG
BACKUP_DEST='$BACKUP_DEST'
BACKUP_NOTIFICATION='$BACKUP_NOTIFICATION'
DISCORD_WEBHOOK_URL='$DISCORD_WEBHOOK_URL'
SLACK_WEBHOOK_URL='$SLACK_WEBHOOK_URL'

# POSTGRES DATABASE CONFIGURATION
POSTGRES_DB_HOST='$POSTGRES_DB_HOST'
POSTGRES_DB_NAME='$POSTGRES_DB_NAME'
POSTGRES_DB_USER='$POSTGRES_DB_USER'
POSTGRES_DB_PASSWORD='$POSTGRES_DB_PASSWORD'

# MYSQL DATABASE CONFIGURATION
MYSQL_HOST='$MYSQL_HOST'
MYSQL_DB_NAME='$MYSQL_DB_NAME'
MYSQL_DB_USER='$MYSQL_DB_USER'
MYSQL_DB_PASSWORD='$MYSQL_DB_PASSWORD'

#AWS S3 CONFIGURATION
AWS_ACCESS_KEY_ID='$AWS_ACCESS_KEY_ID'
AWS_SECRET_ACCESS_KEY='$AWS_SECRET_ACCESS_KEY'
AWS_S3_BUCKET_NAME='$AWS_S3_BUCKET_NAME'
AWS_REGION='$AWS_REGION'
EOF

echo ".env file created successfully!"


pnpm install && pnpm start