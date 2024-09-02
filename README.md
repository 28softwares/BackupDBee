# autobackup-db-and-email

Effortlessly manage your database backups at one go. This easy-to-use tool supports MySQL & PostgreSQL allowing you to back up multiple databases at once.

#### Key features include:

- Multiple Database Support: Seamlessly back up MySQL & PostgreSQL in one go. Note: For now we support MySQL and PostgreSQl.
- Automated Backups: Schedule and automate backups to ensure your data is always protected without manual intervention.
- Compression: Compress backups into zip files to save storage space and optimize transfer times.
- Email Integration: Instantly send backup files directly to your inbox or designated recipients for easy access and archiving.
- Get Notified: Receive notifications for successful and failed backups to stay informed and take action as needed. (on Discord or Slack). _Supports only one Notifier for all backups_

## Clone the project :

```
git clone https://github.com/28softwares/autobackup-db-and-email.git
cd autobackup-db-and-email
```

### Initial Setup

Make sure to install nodejs and zip in the linux server.

```bash
    sudo apt-get install zip && npm i
    # make it executable
    chmod +x index.sh
    #To test the file Run the following command.
    ./index.sh
```

### Configurations

Add your database configuration in '.env' as

```env


# use for postgres.
POSTGRES_DB_HOST='localhost'
POSTGRES_DB_USER='postgres'
POSTGRES_DB_PASSWORD='password'
POSTGRES_DB_NAME='database_name' #also set multiple database names separated by comma.i.e. 'database_name,database_name2,database_name3'

POSTGRES_DB_PORT=5432
#ignore postgres config in env if not used.


# use for mysql.
MYSQL_DB_HOST='localhost'
MYSQL_DB_USER='root'
MYSQL_DB_PASSWORD='password'
MYSQL_DB_NAME='database_name' #multiple db names as like above.
MYSQL_DB_PORT=3306
#ignore mysql config in env if not used.


```

To send backup through mail you need to add mail credentials to .env.
Note: You cannot pass your regular password if 2FA is enabled on your mail account. For this, You can create an app specific password from here [Google App Password]: https://myaccount.google.com/apppasswords.

```bash
  MAIL_USER='example@gmail.com'
  MAIL_PASSWORD='example password'
```

Set the cronjob.

```bash
crontab -e

#at the crontab file, add the following script.
#minute hour dayOfMonth month dayOfWeek commandToRun
* * * * * commandToRun {_ can be any value}~~
```

_OR, you can use process managers as_

```
pm2 start src/index.js --name dbbackup --cron "* * * * *"
```

## Feel Free To Contribute

Customize it further based on your tool’s specific features and benefits! PR are welcome.

---

## Todos

- [ ] S3 Bucket Integration (Currently, the backup db is only sent to GMAIL. When GMAIL gets full, s3 can be our alternative. For this, we check for `BACKUP_DEST=S3_BUCKET`)
- [ ] Multiple Email Support (Currently, only one email can be sent. We can add multiple emails to send the backup to multiple people)
- [ ] To make project CLI Based (Since we have `scripts/dump_data_for_test.sh` which we have to do manually, but if we can make cli based from `index.sh` then it will be more user friendly; by providing flags)
