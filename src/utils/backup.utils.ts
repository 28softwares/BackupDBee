import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import { spawn } from "child_process";
import Print from "../constants/Print";
import { resolve } from "path";
import { ConfigType } from "../types";
import { execAsync } from "..";
import { sendMail } from "./mailer.utils";
import 'dotenv/config'

const ensureDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

const backupHelper = async (data: ConfigType) => {
  const timeStamp = Math.round(Date.now());
  const dumpFileName = `${timeStamp}-${data.db_name}.dump.sql`;

  // ensure backup directory exists
  const backupDir = resolve("backups", `${data.db_name}`);
  ensureDirectory(backupDir);

  // Full path for dump file
  const dumpFilePath = resolve(backupDir, dumpFileName);

  // create a write stream for the dump file
  const write = createWriteStream(dumpFilePath);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dump: any;
  let errorMsg: string | null = null;

  switch (data.type) {
    case "mysql":
      dump = spawn(
        "mysqldump",
        ["-h", data.host!, "-u", data.user!, data.db_name!],
        {
          // eslint-disable-next-line no-undef
          env: { ...process.env, MYSQL_PWD: data.password },
        }
      );
      break;
    case "postgres":
      dump = spawn(
        "pg_dump",
        ["-h", data.host!, "-U", data.user!, "-d", data.db_name!],
        {
          // eslint-disable-next-line no-undef
          env: { ...process.env, PGPASSWORD: data.password },
        }
      );
      break;
    default:
      return Promise.reject(`Unsupported database type: ${data.type}`);
  }

  return new Promise((resolve, reject) => {
    dump.stdout.pipe(write);

    // capture stderr and error events
    dump.stderr.on("data", (data: string) => {
      errorMsg = data.toString();
      Print.error(`${errorMsg}`);
    });

    dump.on("error", (err: string) => {
      console.error(`Error spawning dump process: ${err}`);
      Print.error(`Cannot backup ${data.db_name}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      existsSync(dumpFilePath) && rmSync(dumpFilePath);
      reject(`Cannot backup ${data.db_name}`);
    });

    dump.on("close", async (code: number) => {
      if (code !== 0 || errorMsg) {
        console.error(
          `Dump process failed with code ${code}. Error: ${errorMsg}`
        );
        Print.error(`Cannot backup ${data.db_name}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        existsSync(dumpFilePath) && rmSync(dumpFilePath);
        reject(`Cannot backup ${data.db_name}`);
        return;
      }

      Print.info(`${dumpFileName} successfully created`);
      try {
        //compressing the backup file
        await execAsync(`zip -j ${dumpFilePath}.zip ${dumpFilePath}`);
        // eslint-disable-next-line no-undef
        if (data.mail_backup!=false) {
          sendMail(`${dumpFilePath}.zip`)
        }
        //remove the uncompressed file
        rmSync(dumpFilePath);
        resolve(backupDir);
      } catch {
        Print.error(`Error compressing ${data.db_name}`);
        reject(`Error compressing ${data.db_name}`);
      }
    });
  });
};

export default backupHelper;
