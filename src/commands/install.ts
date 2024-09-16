import { intro, confirm, spinner } from "@clack/prompts";
import * as fs from "fs";
import process from "process";
import chalk from "chalk";
import path from "path";
import { checkCommands } from "./commandChecker";

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

const createBackupdbeeYaml = () => {
  // eslint-disable-next-line no-undef
  const sourceFile = path.join(__dirname, "../../backupdbee.yaml.sample");
  // eslint-disable-next-line no-undef
  const destinationFile = path.join(__dirname, "../../backupdbee.yaml");

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

const install = async () => {
  const multiLineMessage = `
Welcome to My Backupdbee Cli!
Using this cli you can manage your database backup and notification!
`;

  console.log(centerMultilineText(multiLineMessage));
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
        message: "Do you want to continue?",
        initialValue: false,
      });
      if (!shouldContinue) {
        process.exit(0);
      } else {
        createBackupdbeeYaml();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export default install;
