import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from "child_process";
import Print from "../constants/Print";
import path from "path";
import { ConfigType, NotifyOnMedium } from "../@types/types";
import { execAsync } from "..";
import { sendMail } from "./mailer.utils";
import "dotenv/config";

import { notify } from "./notify.utils";
import EnvConfig from "../constants/env.config";

const ensureDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

interface DumpType {
  databaseName: string;
  dumpedContent: ChildProcessWithoutNullStreams;
}

const spawnDumpProcess = (
  command: string,
  args: string[],
  env: Record<string, string | undefined>
): ChildProcessWithoutNullStreams => {
  return spawn(command, args, { env } as SpawnOptionsWithoutStdio);
};

const handleMysqlDump = (data: ConfigType, dumps: DumpType[]) => {
  const dbNames = data.db_name?.includes(",")
    ? data.db_name!.split(",")
    : [data.db_name!];
  const args = ["-h", data.host!, "-u", data.user!, "--databases", ...dbNames];
  // eslint-disable-next-line no-undef
  const env = { ...process.env, MYSQL_PWD: data.password };

  const dumpProcess = spawnDumpProcess("mysqldump", args, env);

  return dumps.push({
    databaseName: data.db_name!,
    dumpedContent: dumpProcess,
  });
};

const handlePostgresDump = (data: ConfigType, dumps: DumpType[]) => {
  const dbNames = data.db_name!.includes(",")
    ? data.db_name!.split(",")
    : [data.db_name!];

  dbNames.forEach((dbName) => {
    const args = ["-h", data.host!, "-U", data.user!, "-d", dbName];
    // eslint-disable-next-line no-undef
    const env = { ...process.env, PGPASSWORD: data.password };

    const dumpedData = spawnDumpProcess("pg_dump", args, env);
    dumps.push({ databaseName: dbName, dumpedContent: dumpedData });
  });
};

const handleDumpError = (
  err: string,
  databaseName: string,
  dumpFilePath: string,
  reject: (reason?: any) => void
) => {
  console.error(`Error spawning dump process: ${err}`);
  Print.error(`Cannot backup ${databaseName}`);
  if (existsSync(dumpFilePath)) {
    rmSync(dumpFilePath);
  }
  reject(new Error(`Cannot backup ${databaseName}`));
};

const handleDumpFailure = (
  code: number,
  errorMsg: string | null,
  databaseName: string,
  dumpFilePath: string,
  reject: (reason?: any) => void
) => {
  console.error(`Dump process failed with code ${code}. Error: ${errorMsg}`);
  Print.error(`Cannot backup ${databaseName}`);
  if (existsSync(dumpFilePath)) {
    rmSync(dumpFilePath);
  }
  reject(new Error(`Cannot backup ${databaseName}`));
};

const finalizeBackup = async (
  dumpFilePath: string,
  databaseName: string,
  backupDest: string | undefined,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void
) => {
  const compressedFilePath = `${dumpFilePath}.zip`;

  try {
    await execAsync(`zip -j ${compressedFilePath} ${dumpFilePath}`);

    switch (backupDest) {
      case "GMAIL":
        await sendMail(compressedFilePath);
        break;
      default:
        break;
    }

    rmSync(dumpFilePath);
    resolve(compressedFilePath);
  } catch (err: unknown) {
    console.error(
      `Error compressing ${databaseName}: ${(err as Error).message}`
    );
    Print.error(`Error compressing ${databaseName}`);
    reject(new Error(`Error compressing ${databaseName}`));
  }
};

const backupHelper = async (data: ConfigType) => {
  const dumps: DumpType[] = [] as DumpType[];
  let errorMsg: string | null = null;

  switch (data.type) {
    case "mysql":
      if (data.db_name && data.user && data.password)
        handleMysqlDump(data, dumps);
      break;
    case "postgres":
      // If multiple database name given, dump all databases
      if (data.db_name && data.user && data.password)
        handlePostgresDump(data, dumps);
      break;
    default:
      return Promise.reject(
        new Error(`Unsupported database type: ${data.type}`)
      );
  }

  // prepare for backup
  const timeStamp = Date.now().toString();
  const backupDir = path.resolve("backups");
  ensureDirectory(backupDir);

  return new Promise((resolve, reject) => {
    dumps.forEach(({ databaseName, dumpedContent }) => {
      const dumpFileName = `${timeStamp}-${databaseName}.dump.sql`;
      const dumpFilePath = path.resolve(backupDir, dumpFileName);
      const writeStream = createWriteStream(dumpFilePath);

      dumpedContent.stdout.pipe(writeStream);

      dumpedContent.stderr.on("data", (chunk) => {
        errorMsg = chunk.toString();
        Print.error(errorMsg ?? "Error occurred while dumping");
      });

      dumpedContent.on("error", (err) => {
        handleDumpError(err.message, databaseName, dumpFilePath, reject);
      });

      dumpedContent.on("close", async (code: number) => {
        if (code !== 0 || errorMsg) {
          handleDumpFailure(code, errorMsg, databaseName, dumpFilePath, reject);
          return;
        }

        console.log(`Backup of ${databaseName} completed successfully`);
        await finalizeBackup(
          dumpFilePath,
          databaseName,
          data.backupDest,
          resolve,
          reject
        );
        //

        await notify([EnvConfig.BACKUP_NOTIFICATION] as NotifyOnMedium[], {
          databaseName,
        });
      });
    });
  });
};

export default backupHelper;
