import process from "process";
import { Command } from "commander";
import install from "./src/commands/install";
import { dbBackup, dbList } from "./src/commands/database";

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

program.parse(process.argv);
