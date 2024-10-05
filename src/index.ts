import backupHelper from "./utils/backup.utils";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";
import Log from "./constants/log";
import { sendNotification } from "./utils/notify.utils";
import { Destinations, Notifications } from "./@types/config";
import { validateDBConfig } from "./validators/config";
import { getDefaultPortOfDBType } from "./setup";
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
