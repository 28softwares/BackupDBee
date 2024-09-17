# `db:backup` Command Documentation

The `db:backup` command is used to back up all databases defined in the YAML configuration, or a specific one using the `--name` flag.

## Usage

### Backup All Databases

To back up all databases, simply run the following command:

```bash
ts-node index.ts db:backup
```

### Backup Specific Database

To back up a specific database, use the `--name` flag followed by the name of the database. For example:

```bash
node index.ts db:backup --name <database_name>
```
