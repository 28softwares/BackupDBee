import { loadConfig } from "./utils";
import { Database, DataBeeConfig } from "../@types/config";
import chalk from "chalk";
import { intro, outro } from "@clack/prompts";
import { main } from "..";
import { setupDBConfig, setupDestinations, setupNotifications } from "../setup";
import process from "process";

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
const setupMainFunction = async (config: DataBeeConfig) => {
  const dbConfig = setupDBConfig(config);
  const destinations = setupDestinations(config);
  const notifications = setupNotifications(config);
  await main(dbConfig, destinations, notifications);
};

export const dbBackup = async (options: { name?: string }) => {
  const config = loadConfig();
  const databases = config.databases;

  try {
    if (options.name) {
      // Backup specific database
      const db = databases.find((db: Database) => db.name === options.name);
      // update config with the specific database
      if (db) {
        config.databases = [db];
        intro(chalk.blueBright(`Backing up database: ${options.name}`));
        await setupMainFunction(config); // Call main function to backup specific database
      } else {
        console.log(chalk.red(`Database "${options.name}" not found.`));
        process.exit(1);
      }
    } else {
      // Backup all databases
      intro(chalk.blueBright("Backing up all databases..."));
      await setupMainFunction(config); // Call main function to backup all databases
    }
  } catch (e) {
    console.log(e);
    outro(chalk.red("Backup failed."));
  }
};
