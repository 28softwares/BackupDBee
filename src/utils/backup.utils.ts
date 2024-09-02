import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import { spawn } from "child_process";
import Print from "../constants/Print";
import path from "path";
import { ConfigType } from "../@types/types";
import { execAsync } from "..";
import { sendMail } from "./mailer.utils";
import "dotenv/config";
import EnvConfig from "../constants/env.config";
import { sendDiscordNotification } from "./discord.utils";

const ensureDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

const backupHelper = async (data: ConfigType) => {
  const dump: { databaseName: string; dumpedContent: any }[] = [];
  let temp;
  let errorMsg: string | null = null;

  switch (data.type) {
    case "mysql":
      // If multiple database name given, dump all databases
      if (data.db_name?.includes(",")) {
        const dbNames = data.db_name!.split(",");
        spawn(
          "mysqldump",
          ["-h", data.host!, "-u", data.user!, "--databases", ...dbNames],
          {
            // eslint-disable-next-line no-undef
            env: { ...process.env, MYSQL_PWD: data.password },
          }
        ).stdout.on("data", (data) => {
          dump.push({
            databaseName: dbNames[0],
            dumpedContent: data.toString(),
          });
        });
      } else {
        spawn(
          "mysqldump",
          ["-h", data.host!, "-u", data.user!, data.db_name!],
          {
            // eslint-disable-next-line no-undef
            env: { ...process.env, MYSQL_PWD: data.password },
          }
        ).stdout.on("data", (data) => {
          dump.push({
            databaseName: data.db_name!,
            dumpedContent: data.toString(),
          });
        });
      }
      break;
    case "postgres":
      // If multiple database name given, dump all databases
      if (data.db_name!.includes(",")) {
        const dbNames = data.db_name!.split(",");

        //loop through it
        for (let i = 0; i < dbNames.length; i++) {
          temp = spawn(
            "pg_dump",
            ["-h", data.host!, "-U", data.user!, "-d", dbNames[i]],
            {
              // eslint-disable-next-line no-undef
              env: { ...process.env, PGPASSWORD: data.password },
            }
          );

          dump.push({ databaseName: dbNames[i], dumpedContent: temp });
        }
      } else {
        temp = spawn(
          "pg_dump",
          ["-h", data.host!, "-U", data.user!, "-d", data.db_name!],
          {
            // eslint-disable-next-line no-undef
            env: { ...process.env, PGPASSWORD: data.password },
          }
        );

        dump.push({
          databaseName: data.db_name!,
          dumpedContent: temp,
        });
      }

      break;
    default:
      return Promise.reject(`Unsupported database type: ${data.type}`);
  }
  // prepare for backup

  const timeStamp = Math.round(Date.now());
  let dumpFileName = "";

  // create a write stream for the dump file
  let write;

  return new Promise((resolve, reject) => {
    dump.forEach((_) => {
      dumpFileName = `${timeStamp}-${_.databaseName}.dump.sql`;
      // ensure backup directory exists
      const backupDir = path.resolve("backups");
      ensureDirectory(backupDir);

      // Full path for dump file
      const dumpFilePath = path.resolve(backupDir, dumpFileName);
      write = createWriteStream(dumpFilePath);

      //
      _.dumpedContent.stdout.pipe(write);

      // capture stderr and error events
      _.dumpedContent.stderr.on("data", (data: string) => {
        errorMsg = data.toString();
        Print.error(`${errorMsg}`);
      });

      _.dumpedContent.on("error", (err: string) => {
        console.error(`Error spawning dump process: ${err}`);
        Print.error(`Cannot backup ${_.databaseName}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        existsSync(dumpFilePath) && rmSync(dumpFilePath);
        reject(`Cannot backup ${_.databaseName}`);
      });

      _.dumpedContent.on("close", async (code: number) => {
        if (code !== 0 || errorMsg) {
          console.error(
            `Dump process failed with code ${code}. Error: ${errorMsg}`
          );
          Print.error(`Cannot backup ${_.databaseName}`);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          existsSync(dumpFilePath) && rmSync(dumpFilePath);
          reject(`Cannot backup ${_.databaseName}`);
          return;
        }

        Print.info(`${dumpFileName} successfully created`);
        try {
          //compressing the backup file
          await execAsync(`zip -j ${dumpFilePath}.zip ${dumpFilePath}`);

          switch (data.backupDest) {
            case "GMAIL":
              await sendMail(`${dumpFilePath}.zip`);
              break;
            default:
              break;
          }

          //remove the uncompressed file
          rmSync(dumpFilePath);
          resolve(backupDir);
        } catch {
          Print.error(`Error compressing ${data.db_name}`);
          reject(`Error compressing ${data.db_name}`);
          return;
        }
        // send notification to discord if webhook url is set and backup notification is set to discord
        if (
          EnvConfig.DISCORD_WEBHOOK_URL &&
          EnvConfig.BACKUP_NOTIFICATION === "DISCORD"
        ) {
          await sendDiscordNotification(_.databaseName);
        }
      });
    });
  });
};

export default backupHelper;
