import { intro, confirm, spinner } from "@clack/prompts";
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
  const s = spinner();
  s.start("Creating backupdbee.yaml file");

  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the source file:", err);
      process.exit(0);
    }

    // Write the content to the destination file
    fs.writeFile(destinationFile, data, (err) => {
      if (err) {
        s.stop(`Error writing to the destination file: ${err}`);
        process.exit(0);
      } else {
        s.stop(`File copied successfully to ${destinationFile}`);
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

  intro(chalk.inverse("Installation"));
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
      chalk.green(
        "Next Step: Update the backupdbee.yaml file with your configurations."
      )
    );
  } catch (err) {
    console.log(err);
  }
};

export default install;
