import process from "process";
import { Command } from "commander";
import install from "./src/commands/install";

const program = new Command();
program.version("1.0.0").description("AutoBackup DB CLI");

program
  .command("install")
  .alias("i")
  .description(
    "Check required commands, create .env file and install dependencies"
  )
  .action(install);

program.parse(process.argv);
