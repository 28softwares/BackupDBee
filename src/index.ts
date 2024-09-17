import "dotenv/config";
import backupHelper from "./utils/backup.utils";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";
import Log from "./constants/log";
import { sendNotification } from "./utils/notify.utils";
import { readFileSync } from "fs";
import * as yaml from "yaml";
import { DataBeeConfig, Destinations, Notifications } from "./@types/config";
import { validateDBConfig } from "./validators/config";
import {
  getDefaultPortOfDBType,
  setupDBConfig,
  setupDestinations,
  setupNotifications,
} from "./setup";
// Promisify exec to use with async/await
export const execAsync = promisify(exec);

export const main = async (
  configs: ConfigType[],
  destinations: Destinations,
  notifications: Notifications
) => {
  for (const config of configs) {
    // if no config provided, then only backup will be done
    if (validateDBConfig(config)) {
      try {
        if (!config.port) {
          config.port = getDefaultPortOfDBType(config.type);
        }
        const dumpInfo = await backupHelper(config, destinations);
        if (!dumpInfo) {
          Log.error("Backup failed.");
          return;
        }
        if (!dumpInfo.compressedFilePath) {
          Log.error("Backup failed.");
          return;
        }
        await sendNotification(dumpInfo, notifications);
      } catch (e: unknown) {
        Log.error("Backup failed." + e);
      }
    }
  }
};

function parseConfigFile(path: string = "backupdbee.yaml"): DataBeeConfig {
  const configFile = readFileSync(path, "utf-8");
  const yamlConfig = yaml.parse(configFile) as DataBeeConfig;
  return yamlConfig;
}

const dataBeeConfig = parseConfigFile();
main(
  setupDBConfig(dataBeeConfig),
  setupDestinations(dataBeeConfig),
  setupNotifications(dataBeeConfig)
);
