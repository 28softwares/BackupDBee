/* eslint-disable @typescript-eslint/no-unused-expressions */
import backupHelper from "./utils/backup.utils";
import Print from "./constants/Print";
import dbConfig from "../config";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";

// Promisify exec to use with async/await
export const execAsync = promisify(exec);

const main = async (configs: ConfigType[]) => {
  for (const config of configs) {
    try {
      await backupHelper(config);
    } catch (error) {
      console.error("Backup failed", error);
      Print.error("Backup failed.");
    }
  }
};

main(dbConfig);
