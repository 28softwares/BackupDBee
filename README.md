# auto-db-backup-and-email

1. Put the database name,user and password in the src/constants/data.ts which needs to keep backup
2. Put the smtp credentials and mail where backup file is sent in src/utils/mailer.utils.ts
3. Simply run the cron jobs at which interval you want backup
4. simply run the script npm run start nto take backup

###### data.json inside src/constants/data.json  for database lists

### shell scripting

1. First arguments contains the smtp username
2. second arguments contains password of smtp transporter
3. third arguments contains the gmail where mail is to be sent

### running this shell scipting in certain interval

sh ./index.sh username password mailto
