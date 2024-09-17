import { loadConfig } from "./utils";
import { Database } from "../@types/config";
import chalk from "chalk";

export const dbList = () => {
  const config = loadConfig();
  console.log("Database List");
  const databases = config.databases;
  if (databases && databases.length > 0) {
    databases.forEach((db: Database, index: number) => {
      console.log(`${index + 1}. ${db.name}`);
    });

    console.log(
      `\n${chalk.yellow("Total databases:")} ${chalk.magenta(databases.length)}`
    );
  } else {
    console.log(chalk.red("No databases found in configuration."));
  }
};
