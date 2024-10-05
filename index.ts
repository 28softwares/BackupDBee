import process from "process";
import { Command } from "commander";
import install from "./src/commands/install";
import { dbBackup, dbList } from "./src/commands/database";
import general from "./src/commands/general";

const program = new Command();
program.version("1.0.0").description("BackupDBee CLI");

program
  .command("install")
  .alias("i")
  .description("Check required commands, create backupdbee.yaml file")
  .action(async () => await install());

program
  .command("db:list")
  .description("List all databases and show the total count")
  .action(dbList);

program
  .command("db:backup")
  .description("Backup all databases or a specific one with --name flag")
  .option("--name <dbName>", "Name of the database to backup")
  .action((options: { name?: string }) => {
    dbBackup(options);
  });

program
  .command("general")
  .description("Configure general settings in backupdbee.yaml")
  .option("--backup-location <location>", "Set the backup location")
  .option("--log-location <location>", "Set the log location")
  .option("--log-level <level>", "Set the log level (e.g., INFO, DEBUG)")
  .option("--retention-policy <days>", "Set retention policy in days", parseInt)
  .option("--backup-schedule <cron>", "Set backup schedule in cron format")
  .action(async (options) => {
    general(options);
  });

program.parse(process.argv);
