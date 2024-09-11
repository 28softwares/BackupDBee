# BackupDBee 🐝

Effortlessly manage your database backups at one go. This easy-to-use tool supports MySQL & PostgreSQL allowing you to back up multiple databases at once.

#### Key features: 🚀

✅ Multiple Database Support: Seamlessly back up MySQL & PostgreSQL in one go. (Note: For now we support MySQL and PostgreSQl.)
✅ Support for GMAIL,S3 BUCKET for storing the backup. (Backups are transfered in zip format, reducing backup size.)
✅ Multiple Email Recipients: Send backups to multiple email recipients. (if `BACKUP_DEST` is set to `GMAIL`)
✅ Notify on Discord or Slack for successful and failed backups.
✅ Automated Backups: Schedule and automate backups (using crons or pm2) to ensure your data is always protected without manual intervention.

## Clone the project 📦

```
git clone https://github.com/28softwares/backupdbee.git
cd backupdbee
```

### Initial Setup

Make sure to install nodejs and zip in the linux server.

```bash
node index.mjs install #this creates .env file
```

### Configurations ⚒️

For GMAIL, you need to enable less secure apps in your gmail account. [Click here to enable less secure apps](https://myaccount.google.com/lesssecureapps)

```bash
crontab -e

#at the crontab file, add the following script.
#minute hour dayOfMonth month dayOfWeek commandToRun
* * * * * commandToRun {_ can be any value}~~
```

_OR, you can use process managers as_

```
pm2 start src/index.mjs --name dbbackup --cron "* * * * *"
```

## Feel Free To Contribute 👌

Customize it further based on your tool’s specific features and benefits! PR are welcome.

Current work updates can be found at:
[https://github.com/orgs/28softwares/projects/1](https://github.com/orgs/28softwares/projects/1)

## Contributors 🤝

<a href = "https://github.com/28softwares/backupdbee">
  <img src = "https://contrib.rocks/image?repo=28softwares/backupdbee"/>
</a>
