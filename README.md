####Clone the project :

```
git clone https://github.com/28softwares/autobackup-db-and-email .
cd autobackup-db-and-email
```

#### Intially supply configuration to src/config.db.json as

```json
[
  // supply one or multiple configurations.
  {
    "user": "root", // database user name
    "password": "iamsohappy", //database password
    "database": "database1", //database name
    "type": "postgres" // database type; optional for mysql.
  },
  {
    "user": "root",
    "password": "iamsohappy",
    "database": "database2",
    "type": "postgres"
  }
]
```

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
