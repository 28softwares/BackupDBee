## Clone the project :

```
git clone https://github.com/28softwares/autobackup-db-and-email .
cd autobackup-db-and-email
```

#### Initial Setup

  const dbConfig:ConfigType[]   = [
    {
      host: process.env.HOST,
      db_name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      type: "postgres",
      port: 5432, // Optional
      ssl: false, //Optional
    },
    // ADD OTHER DATABASE CONFIGURATION HERE....
  ];


##### and save it.

Make sure to install nodejs and zip in the linux server.

```bash

    sudo apt-get install zip && npm i
    chmod +x index.sh # adding executable mode to the file.
    #To test the file Run the following command.
    ./index.sh
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

### Todo

1. Delete the locally saved backup files after sending mail
