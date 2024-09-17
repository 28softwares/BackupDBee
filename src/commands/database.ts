import { Database, DataBeeConfig } from "../@types/config";
import chalk from "chalk";
import { spinner } from "@clack/prompts";
import { setupDBConfig, setupDestinations, setupNotifications } from "../setup";
import process from "process";
import { main } from "..";
import { config } from "../utils/cli.utils";

/**
 * Retrieves the list of databases from the configuration and logs them to the console.
 */
export const dbList = () => {
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

/**
 * Sets up the main function for performing database operations.
 *
 * @param config - The configuration object for setting up the main function.
 * @returns A Promise that resolves when the main function completes.
 */
const setupMainFunction = async (config: DataBeeConfig) => {
  const dbConfig = setupDBConfig(config);
  const destinations = setupDestinations(config);
  const notifications = setupNotifications(config);
  await main(dbConfig, destinations, notifications);
};

/**
 * Performs a database backup.
 *
 * @param options - An optional object containing the name of the specific database to backup.
 * @param options.name - The name of the specific database to backup.
 *
 * @remarks
 * If the `options.name` parameter is provided, the function will backup only the specified database.
 * If the `options.name` parameter is not provided, the function will backup all databases.
 *
 * @throws {Error} If the backup fails.
 */
export const dbBackup = async (options: { name?: string }) => {
  const databases = config.databases;

  try {
    if (options.name) {
      // select specific database
      const db = databases.find((db: Database) => db.name === options.name);
      // update config with the specific database
      if (db) {
        config.databases = [db];
        const s = spinner();
        s.start(`Backing up database: ${options.name}\n`);
        await setupMainFunction(config); // Call main function to backup specific database
        s.stop();
      } else {
        console.log(chalk.red(`Database "${options.name}" not found.`));
        process.exit(1);
      }
    } else {
      // Backup all databases
      const s = spinner();
      s.start("Backing up all databases\n");
      await setupMainFunction(config); // Call main function to backup all databases
      s.stop();
    }
  } catch (e) {
    console.log(e);
    console.log(chalk.red("Backup failed."));
  }
};
