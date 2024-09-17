import process from "process";
import { Command } from "commander";
import install from "./src/commands/install";
import backUpDest from "./src/commands/backUpDest";
import updateHelper from "./src/commands/updateHelper";
import notificationDest from "./src/commands/notificationDest";
import { dbList } from "./src/commands/database";

const program = new Command();
program.version("1.0.0").description("AutoBackup DB CLI");

program
  .command("install")
  .alias("i")
  .description(
    "Check required commands, create .env file and install dependencies"
  )
  .action(async () => await install());

program
  .command("db:list")
  .description("List all databases and show the total count")
  .action(dbList);

program
  .command("update-backup-destination")
  .alias("ubd")
  .description("Update backup destinations")
  .action(
    async () => await updateHelper("Update backup destinations", backUpDest)
  );

program
  .command("update-notification")
  .alias("un")
  .description("Update notification")
  .action(
    async () => await updateHelper("Update notification", notificationDest)
  );

program.parse(process.argv);
