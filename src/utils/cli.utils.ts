import { readFileSync, writeFileSync } from "fs";
import path from "path";
import * as yaml from "yaml";
import * as fs from "fs";
import { DataBeeConfig } from "../@types/config";

// eslint-disable-next-line no-undef
export const sourceFile = path.join(__dirname, "../../backupdbee.yaml.sample");
// eslint-disable-next-line no-undef
export const destinationFile = path.join(__dirname, "../../backupdbee.yaml");

export function parseConfigFile(): DataBeeConfig {
  const configFile = readFileSync(destinationFile, "utf-8");
  const yamlConfig = yaml.parse(configFile) as DataBeeConfig;
  return yamlConfig;
}

export function saveConfig(config: DataBeeConfig) {
  const yamlString = yaml.stringify(config);
  writeFileSync(destinationFile, yamlString, "utf8");
}

function parseSampleFileBeforeInstall(): DataBeeConfig {
  const configFile = readFileSync(sourceFile, "utf-8");
  const yamlConfig = yaml.parse(configFile) as DataBeeConfig;
  return yamlConfig;
}

export const config = fs.existsSync(destinationFile)
  ? parseConfigFile()
  : parseSampleFileBeforeInstall();
