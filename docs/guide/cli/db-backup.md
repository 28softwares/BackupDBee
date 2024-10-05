# `db:backup` Command Documentation

The `db:backup` command is used to back up all databases defined in the YAML configuration or specific ones using the `--name` flag. You can pass multiple databases to `--name` flag by providing a comma-separated list of database names.

## Usage

### Backup All Databases

To back up all databases, simply run the following command:

```bash
ts-node index.ts db:backup
```

### Backup Specific Database(s)

To back up one or more specific databases, use the `--name` flag followed by the database name(s). You can provide a single database name or multiple names separated by commas.

#### Backup a Single Database:

```bash
ts-node index.ts db:backup --name <database_name>
```

#### Backup Multiple Databases:

```bash
ts-node index.ts db:backup --name <database_name_1>,<database_name_2>,<database_name_3>
```
