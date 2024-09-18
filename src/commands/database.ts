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
 * Backs up databases based on the provided options.
 *
 * @param options - An object containing optional parameters.
 * @param options.name - A comma-separated string of database names to back up. If not provided, all databases will be backed up.
 *
 * The function performs the following steps:
 * 1. If `options.name` is provided, it splits the name by commas to handle multiple databases.
 * 2. It filters the databases to find those that match any of the provided names.
 * 3. If matching databases are found, it updates the configuration to include only the selected databases and starts the backup process.
 * 4. If no matching databases are found, it logs an error message and exits the process.
 * 5. If `options.name` is not provided, it backs up all databases.
 * 6. In case of any errors during the backup process, it logs the error and a failure message.
 *
 * @throws Will log an error and exit the process if no matching databases are found.
 * @throws Will log an error message if the backup process fails.
 */
export const dbBackup = async (options: { name?: string }) => {
  const databases = config.databases;

  try {
    if (options.name) {
      // Split the name by commas to handle multiple databases
      const dbNames = options.name.split(",").map((name) => name.trim());

      // Find the databases that match any of the names
      const selectedDatabases = databases.filter((db: Database) =>
        dbNames.includes(db.name)
      );
      // Extracting the names of the selected databases and not found databases from dbNames
      const selectedDatabaseNames = selectedDatabases.map(
        (db: Database) => db.name
      );
      const notFoundDatabases = dbNames.filter(
        (name) => !selectedDatabaseNames.includes(name)
      );

      if (selectedDatabases.length) {
        config.databases = selectedDatabases;
        const s = spinner();
        if (notFoundDatabases.length) {
          console.log(
            chalk.yellow(
              `No matching databases found for: ${notFoundDatabases.join(", ")}`
            )
          );
        }
        s.start(`Backing up databases: ${selectedDatabaseNames.join(", ")}`);
        await setupMainFunction(config); // Call main function to backup selected databases
        s.stop();
      } else {
        console.log(
          chalk.red(`No matching databases found for: ${dbNames.join(", ")}`)
        );
        process.exit(1);
      }
    } else {
      // Backup all databases
      const s = spinner();
      s.start("Backing up all databases");
      await setupMainFunction(config); // Call main function to backup all databases
      s.stop();
    }
  } catch (e) {
    console.log(e);
    console.log(chalk.red("Backup failed."));
  }
};
