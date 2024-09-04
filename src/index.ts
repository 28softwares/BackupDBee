import backupHelper from "./utils/backup.utils";
import dbConfig from "../config";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";
import Log from "./constants/Log";
import { sendNotification } from "./utils/notify.utils";

// Promisify exec to use with async/await
export const execAsync = promisify(exec);

const main = async (configs: ConfigType[]) => {
  for (const config of configs) {
    // if no config provided, then only backup will be done
    if (config.db_name && config.user && config.password) {
      try {
        const dumpInfo = await backupHelper(config);
        if (!dumpInfo) {
          Log.error("Backup failed.");
          return;
        }

        await sendNotification({
          databaseName: dumpInfo.databaseName,
        });
      } catch (e: unknown) {
        Log.error("Backup failed." + e);
      }
    }
  }
};

main(dbConfig);
