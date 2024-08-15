# autobackup-db-and-email


## Clone the project :

```
git clone https://github.com/28softwares/autobackup-db-and-email .
cd autobackup-db-and-email
```

#### Initial Setup
Make sure to install nodejs and zip in the linux server.

```bash
    sudo apt-get install zip && npm i
    chmod +x index.sh # adding executable mode to the file.
    #To test the file Run the following command.
    ./index.sh
```


#### Initial Setup
Add your database configuration in 'config.ts'
```
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

```
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
