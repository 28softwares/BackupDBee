# `general` Command Documentation

The `general` command is used to configure the general settings of your `backupdbee.yaml` file. You can either use flags to update specific settings or use an interactive mode where you'll be prompted to provide input.

## Command: `general`

```bash
ts-node index.ts general [options]
```

### Description

The `general` command allows you to modify the following general settings in the `backupdbee.yaml` file:

- Backup location
- Log location
- Log level (INFO, DEBUG, ERROR)
- Retention policy (number of days)
- Backup schedule (in cron format)

You can configure each setting individually using the provided flags or choose to use the interactive mode (i.e., no flags) to update settings step-by-step.

---

## Flags

Below is a table describing each flag you can use with the `general` command.

| Flag                 | Description                                                                 | Example Command                                                 |
| -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--backup-location`  | Specify the directory where backups will be stored.                         | `ts-node index.ts general --backup-location "/path/to/backups"` |
| `--log-location`     | Set the directory where logs will be stored.                                | `ts-node index.ts general --log-location "/path/to/logs"`       |
| `--log-level`        | Set the log verbosity level. Accepts values: `INFO`, `DEBUG`, `ERROR`.      | `ts-node index.ts general --log-level DEBUG`                    |
| `--retention-policy` | Specify how many days backups will be retained. Takes a number as an input. | `ts-node index.ts general --retention-policy 10`                |
| `--backup-schedule`  | Set the cron schedule for automatic backups.                                | `ts-node index.ts general --backup-schedule "0 3 * * *"`        |

---

## Interactive Mode

If no flags are provided, the `general` command will enter an interactive mode, where you will be prompted to input values for each setting.
