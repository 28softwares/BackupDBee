import * as fs from "fs";
import path from "path";
import * as yaml from "yaml";
import { DataBeeConfig } from "../@types/config";
import { isCancel } from "@clack/prompts";
import process from "process";
import chalk from "chalk";

// eslint-disable-next-line no-undef
export const sourceFile = path.join(__dirname, "../../backupdbee.yaml.sample");
// eslint-disable-next-line no-undef
export const destinationFile = path.join(__dirname, "../../backupdbee.yaml");

export function loadConfig() {
  try {
    const file = fs.readFileSync(destinationFile, "utf8");
    return yaml.parse(file);
  } catch (error) {
    console.error(chalk.red("Error loading configuration file:"), error);
    process.exit(1);
  }
}

// Save YAML config file
export function saveYamlConfig(config: DataBeeConfig) {
  const yamlStr = yaml.stringify(config);
  fs.writeFileSync(destinationFile, yamlStr, "utf8");
  console.log("Configuration saved to config.yaml");
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const promptWithCancel = async (promptFn: Function, options: object) => {
  const result = await promptFn(options);
  if (isCancel(result)) {
    console.log("Operation cancelled");
    process.exit(0);
  }
  return result;
};
