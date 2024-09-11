import { intro, outro } from "@clack/prompts";
import * as fs from "fs";
import process from "process";
import backUpDest from "./backUpDest";
import { checkCommands } from "./commandChecker";
import chalk from "chalk";
import notificationDest from "./notificationDest";
import database from "./database";

function centerText(text: string) {
  const terminalWidth = process.stdout.columns;
  const textLength = text.length;
  const padding = Math.max(0, Math.floor((terminalWidth - textLength) / 2));
  const paddedText = " ".repeat(padding) + text;
  return paddedText;
}

function centerMultilineText(text: string) {
  return text
    .split("\n")
    .map((line) => centerText(line))
    .join("\n");
}

const install = async () => {
  const multiLineMessage = `
Welcome to My Backupdbee Cli!
Using this cli you can manage your database backup and email notification!
`;

  console.log(centerMultilineText(multiLineMessage));
  const commands = ["zip", "pg_dump", "mysqldump", "pnpm", "node"];
  checkCommands(commands);
  console.log();

  intro(chalk.inverse("Installation"));
  try {
    await backUpDest();
    await notificationDest();
    await database();
    outro(chalk.green("Installation successful!"));
  } catch (err) {
    console.log(chalk.red("Error occured while installing"));
    console.log(chalk.red("Deleting .env file"));
    //delete .env file from root folder
    try {
      fs.unlinkSync(".env");
    } catch (err) {
      console.log(err);
      console.log(chalk.red("Error occured while deleting .env file"));
    }
    console.log(err);
  }
};

export default install;
