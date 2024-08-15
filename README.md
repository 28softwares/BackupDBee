# autobackup-db-and-email
Effortlessly manage your database backups at one go. This easy-to-use tool supports MySQL & PostgreSQL allowing you to back up multiple databases at once.

#### Key features include:

- Multiple Database Support: Seamlessly back up MySQL, PostgreSQL, and other databases in one go. Note: For now we support MySQL and PostgreSQl. 
- Automated Backups: Schedule and automate backups to ensure your data is always protected without manual intervention.
- Compression: Compress backups into zip files to save storage space and optimize transfer times.
- Email Integration: Instantly send backup files directly to your inbox or designated recipients for easy access and archiving.

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
Add your database configuration in 'config.ts'
```typescript
const dbConfig:ConfigType[]   = [
  {
    host: process.env.HOST,
    db_name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    type: "postgres",
    mail_backup: true  // In case you want to send backups to your email, {default:false}
    // Other configuration (Optional)
    port: 5432, // Optional
    ssl: false, //Optional
  },
  // ADD MULTIPLE DATABASE CONFIGURATION HERE....
];
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
* * * * * commandToRun {_ can be any value}
```

OR, you can use process managers as

```
pm2 start src/index.js --name dbbackup --cron "* * * * *"
```


## Feel Free To Contribute
Customize it further based on your tool’s specific features and benefits! PR are welcome. 
