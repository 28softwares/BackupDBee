import { confirm } from "@clack/prompts";
import * as fs from "fs";
import process from "process";
import chalk from "chalk";
import { checkCommands } from "./commandChecker";
import { destinationFile, sourceFile } from "../utils/cli.utils";

/**
 * Creates a backupdbee.yaml file by reading the content from a source file and writing it to a destination file.
 *
 * @remarks
 * This function uses the `fs.readFile` and `fs.writeFile` methods to read and write files respectively.
 * It also utilizes a spinner to display the progress of the operation.
 *
 * @param sourceFile - The path to the source file.
 * @param destinationFile - The path to the destination file.
 */
const createBackupdbeeYaml = () => {
  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the source file:", err);
      process.exit(0);
    }

    // Write the content to the destination file
    fs.writeFile(destinationFile, data, (err) => {
      if (err) {
        console.log(chalk.red(`Error writing to the destination file: ${err}`));
        process.exit(0);
      } else {
        console.log(`\nFile copied successfully to ${destinationFile}`);
      }
    });
  });
};

/**
 * Checks the necessary dependencies and create backupdbee.yaml file.
 *
 * @returns {Promise<void>} A promise that resolves once the installation is complete.
 */
const install = async (): Promise<void> => {
  const commands = ["zip", "pg_dump", "mysqldump", "pnpm", "node"];
  checkCommands(commands);
  console.log();

  try {
    // check if backupdbee.yaml file exists in root folder or not
    if (!fs.existsSync("backupdbee.yaml")) {
      createBackupdbeeYaml();
    } else {
      const shouldContinue = await confirm({
        message: "Backupdbee.yaml file exits. Do you want to override?",
        initialValue: false,
      });
      if (!shouldContinue) {
        process.exit(0);
      } else {
        createBackupdbeeYaml();
      }
    }

    console.log(
      "\nNext Step: Update the backupdbee.yaml file with your configurations."
    );
  } catch (err) {
    console.log(err);
  }
};

export default install;
