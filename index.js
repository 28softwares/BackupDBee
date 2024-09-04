#!/usr/bin/env node

import process from "process";
import { execSync } from "child_process";
import chalk from "chalk";
import { Command } from "commander";
import { input } from "@inquirer/prompts";

const program = new Command();
program.version("1.0.0").description("AutoBackup DB CLI");

program
  .command("install")
  .alias("i")
  .description(
    "Check required commands, create .env file and install dependencies"
  )
  .action(() => {
    const commands = ["zip", "pg_dump", "mysqldump", "pnpm", "node"];

    commands.forEach((command) => {
      try {
        execSync(`${command} -v`);
      } catch (error) {
        console.log(chalk.red(error.message));
        console.log(chalk.red(`${command} command not found!`));
        process.exit(1);
      }
    });
  });

program.parse(process.argv);
