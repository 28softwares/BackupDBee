/* eslint-disable @typescript-eslint/no-unused-expressions */
import backupHelper from "./utils/backup.utils";
import Print from "./constants/Print";
import dbConfig from "../config";
import { exec } from "child_process";
import { ConfigType, NotifyOnMedium } from "./@types/types";
import { promisify } from "util";
import { notify } from "./utils/notify.utils";
import EnvConfig from "./constants/env.config";

// Promisify exec to use with async/await
export const execAsync = promisify(exec);

const main = async (configs: ConfigType[]) => {
  for (const config of configs) {
    try {
      const dumpInfo = await backupHelper(config);
      if (!dumpInfo) {
        Print.error("Backup failed.");
        return;
      }

      await notify(EnvConfig.BACKUP_NOTIFICATION, {
        databaseName: dumpInfo.databaseName,
      });
    } catch (error) {
      console.error("Backup failed", error);
      Print.error("Backup failed.");
    }
  }
};

main(dbConfig);
