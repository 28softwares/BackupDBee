# BackupBee Configuration

This document provides a comprehensive guide to configuring BackupBee using the `backupdbee.yaml` file.

## Table of Contents

1. [General Configuration](#general-configuration)
2. [Destinations](#destinations)
3. [Notifications](#notifications)
4. [Databases](#databases)

## General Configuration

The `general` section contains global settings for BackupBee:

```yaml
general:
  backup_location: backups
  log_location: logs
  log_level: INFO
  retention_policy_days: 7
  backup_schedule: "0 3 * * *"
```

- `backup_location`: Directory where backups are stored
- `log_location`: Directory for log files
- `log_level`: Logging verbosity (e.g., INFO, DEBUG, ERROR)
- `retention_policy_days`: Number of days to retain backups
- `backup_schedule`: Cron expression for backup schedule (default: 3 AM daily)

## Destinations

BackupBee supports multiple backup destinations:

### Local Storage

```yaml
destinations:
  local:
    enabled: true
    path: backups
```

- `enabled`: Set to `true` to use local storage
- `path`: Directory path for local backups

### Amazon S3

```yaml
s3:
  enabled: false
  bucket_name: backupbee
  region: us-east-1
  access_key: XXXXXXXXXXX
  secret_key: XXXXXXXXXXX
```

- `enabled`: Set to `true` to use S3
- `bucket_name`: S3 bucket name
- `region`: AWS region
- `access_key`: AWS access key
- `secret_key`: AWS secret key

### Email

```yaml
email:
  enabled: false
  smtp_server: smtp.gmail.com
  smtp_port: 587
  smtp_username:
  smtp_password:
  from: no-reply@backupbee.com
    to:
      - master@backupbee.com
```

- `enabled`: Set to `true` to send backups via email
- `smtp_server`: SMTP server address
- `smtp_port`: SMTP port
- `smtp_username`: SMTP username
- `smtp_password`: SMTP password
- `from`: Email address used for sending notifications
- `to`: List of email addresses to receive notifications

## Notifications

BackupBee can send notifications through various channels:

### Slack Notifications

```yaml
slack:
  enabled: true
  webhook_url: https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXXXXXXXX
```

### Custom Webhook

```yaml
custom:
  enabled: false
  web_url: https://backupbee.com/api/v1/backup
```

### Discord Notifications

```yaml
discord:
  enabled: false
  webhook_url: https://discord.com/api/webhooks/XXXXXXXXX/XXXXXXXXX
```

### Telegram Notifications

```yaml
telegram:
  enabled: true
  webhook_url: https://api.telegram.org/botXXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/sendMessage
  chatId: XXXXXXX
```

For required notification type, set `enabled` to `true` and provide the necessary credentials or webhook URLs.

## Databases

Configure the databases you want to back up:

```yaml
databases:
  - name: primary_db
    type: postgres
    host: localhost
    port: 5432
    username: postgres
    password: pass
    database_name: asterconsult
    backup_schedule: "0 3 * * *"
```

- `name`: A unique identifier for the database
- `type`: Database type (e.g., postgres, mysql)
- `host`: Database server hostname
- `port`: Database server port
- `username`: Database username
- `password`: Database password
- `database_name`: Name of the database to back up
- `backup_schedule`: Cron expression for this specific database's backup schedule

You can add multiple database configurations by repeating this structure.

To comment out a database configuration, use the `#` symbol at the beginning of each line, as shown in the example for `secondary_db`.

---

Remember to keep your `backupdbee.yaml` file secure, as it contains sensitive information such as database credentials and API keys.
