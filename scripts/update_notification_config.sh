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


# Choose backup notification
echo "Please choose a backup notification option:"
BACKUP_NOTIFICATION=$(prompt_option "SLACK" "DISCORD" "BOTH")

# Initialize notification URLs
SLACK_WEBHOOK_URL=""
DISCORD_WEBHOOK_URL=""

# Collect notification details based on the chosen notification option
if [[ $BACKUP_NOTIFICATION == "SLACK" || $BACKUP_NOTIFICATION == "BOTH" ]]; then
    SLACK_WEBHOOK_URL=$(prompt_input "Enter SLACK_WEBHOOK_URL")
fi

if [[ $BACKUP_NOTIFICATION == "DISCORD" || $BACKUP_NOTIFICATION == "BOTH" ]]; then
    DISCORD_WEBHOOK_URL=$(prompt_input "Enter DISCORD_WEBHOOK_URL")
fi

# Adjust BACKUP_NOTIFICATION value for "Both" choice
if [[ $BACKUP_NOTIFICATION == "BOTH" ]]; then
    BACKUP_NOTIFICATION="SLACK,DISCORD"
elif [[ $BACKUP_NOTIFICATION == "SLACK" ]]; then
    BACKUP_NOTIFICATION="SLACK"
elif [[ $BACKUP_NOTIFICATION == "DISCORD" ]]; then
    BACKUP_NOTIFICATION="DISCORD"
fi

#check if the .env file exists
if [ ! -f .env ]; then
    echo ".env file not found!"
    exit 1
fi

# Update .env file with the new notification settings
update_env_variable "BACKUP_NOTIFICATION" "'$BACKUP_NOTIFICATION'"
update_env_variable "SLACK_WEBHOOK_URL" "'$SLACK_WEBHOOK_URL'"
update_env_variable "DISCORD_WEBHOOK_URL" "'$DISCORD_WEBHOOK_URL'"

echo ".env file has been updated with the new notification settings."
