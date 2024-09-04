#!/bin/bash
prompt_input() {
    read -p "$1 : " input
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

update_env_variable() {
    local key="$1"
    local value="$2"
    local file=".env"

    # Escape special characters in the value
    local escaped_value=$(printf '%s' "$value" | sed 's/[&/\]/\\&/g')

    # If the key exists, replace the line; otherwise, append it
    if grep -q "^$key=" "$file"; then
        sed -i "s|^$key=.*|$key=$escaped_value|" "$file"
    else
        echo "$key=$value" >> "$file"
    fi
}

# Choose backup option
echo "Please choose a backup option:"
BACKUP_DEST=$(prompt_option "GMAIL" "S3_BUCKET")

# Initialize backup details
MAIL_USER=""
MAIL_PASSWORD=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""
AWS_REGION=""

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

# Update the .env file with the chosen backup details
update_env_variable "BACKUP_DEST" "'$BACKUP_DEST'"
update_env_variable "MAIL_USER" "'$MAIL_USER'"
update_env_variable "MAIL_PASSWORD" "'$MAIL_PASSWORD'"
update_env_variable "AWS_ACCESS_KEY_ID" "'$AWS_ACCESS_KEY_ID'"
update_env_variable "AWS_SECRET_ACCESS_KEY" "'$AWS_SECRET_ACCESS_KEY'"
update_env_variable "AWS_S3_BUCKET_NAME" "'$AWS_S3_BUCKET_NAME'"
update_env_variable "AWS_REGION" "'$AWS_REGION'"

echo "Backup destination updated successfully."