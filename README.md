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
```

Syntax for cronjob :
minute hour dayOfMonth month dayOfWeek commandToRun

minute can be 0 to 59.
hour can also be 0 to 59.
dayOfMonth can be 1 to 31.
month can be 1 to 12.
dayOfWeek can be 0 to 7. 0 and 7 means Sunday, 1 means Monday, 2 means Tuesday and so on.

'Command to run'

```bash

\* \* \* \* _ commandToRun {_ can be any value}

```

OR, you can use process managers as

```
pm2 start src/index.js --name dbbackup --cron "* * * * *"
```

### Todo

1. Delete the locally saved backup files after sending mail
