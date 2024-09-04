import backupHelper from "./utils/backup.utils";
import Print from "./constants/Print";
import dbConfig from "../config";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";
import { notify } from "./utils/notify.utils";
import EnvConfig from "./constants/env.config";

// Promisify exec to use with async/await
export const execAsync = promisify(exec);

const main = async (configs: ConfigType[]) => {
  for (const config of configs) {
    // if no config provided, then only backup will be done
    if (config.db_name && config.user && config.password) {
      try {
        const dumpInfo = await backupHelper(config);
        if (!dumpInfo) {
          Print.error("Backup failed.");
          return;
        }

        await notify(EnvConfig.BACKUP_NOTIFICATION, {
          databaseName: dumpInfo.databaseName,
        });
      } catch (e: unknown) {
        Print.error("Backup failed." + e);
      }
    }
  }
};

main(dbConfig);
