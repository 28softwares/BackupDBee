import { execSync } from "child_process";
import process from "process";
import chalk from "chalk";

/**
 * Checks if the required commands are available.
 *
 * @param commands - An array of commands to check.
 * @returns void
 */
export const checkCommands = (commands: string[]) => {
  console.log(chalk.cyan("Checking required commands..."));
  for (const command of commands) {
    try {
      execSync(`which ${command}`);
      console.log(chalk.green(`✓ ${command} is available`));
    } catch (error) {
      console.log(chalk.red(`✗ ${command} command not found!`));
      console.log(chalk.red(`Error details: ${error}`));
      process.exit(1);
    }
  }

  console.log(chalk.green("All required commands are available."));
};
