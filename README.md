# auto-db-backup-and-email

1. Put the database name,user and password in the src/constants/data.ts which needs to keep backup
2. Put the smtp credentials and mail where backup file is sent in src/utils/mailer.utils.ts
3. Simply run the cron jobs at which interval you want backup
4. simply run the script npm run start nto take backup
