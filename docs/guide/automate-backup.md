# Automate Backup

You can use process managers to automate your backup

```bash
pm2 start ts-node index.ts db:backup --name dbbackup --cron "* * * * *"
```
