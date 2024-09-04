import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import * as fs from "fs";
import Print from "../constants/Print";
import path from "path";
import { ConfigType, DumpInfo, DumpType } from "../@types/types";
import { execAsync } from "..";
import { sendMail } from "./mailer.utils";
import "dotenv/config";
import EnvConfig from "../constants/env.config";
import uploadToS3 from "./s3.utils";
import { handleMysqlDump } from "../dbs/mysql";
import { handlePostgresDump } from "../dbs/postgres";

const ensureDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

const handleDumpError = (
  err: string,
  databaseName: string,
  dumpFilePath: string
) => {
  console.error(`Error spawning dump process: ${err}`);
  Print.error(`Cannot backup ${databaseName}`);
  if (existsSync(dumpFilePath)) {
    rmSync(dumpFilePath);
    rmSync(`${dumpFilePath}.zip`);
  }
};

const handleDumpFailure = (
  code: number,
  errorMsg: string | null,
  databaseName: string,
  dumpFilePath: string
) => {
  console.error(`Dump process failed with code ${code}. Error: ${errorMsg}`);
  Print.error(`Cannot backup ${databaseName}`);
  if (existsSync(dumpFilePath)) {
    rmSync(dumpFilePath);
    rmSync(`${dumpFilePath}.zip`);
  }
};

const finalizeBackup = async (dumpFilePath: string, databaseName: string) => {
  const compressedFilePath = `${dumpFilePath}.zip`;

  try {
    await execAsync(`zip -j ${compressedFilePath} ${dumpFilePath}`);

    switch (EnvConfig.BACKUP_DEST) {
      case "GMAIL":
        await sendMail(compressedFilePath);
        break;
      case "S3_BUCKET":
        await uploadToS3(
          dumpFilePath.split("/").pop() + ".zip",
          fs.readFileSync(compressedFilePath)
        );
        break;

      default:
        break;
    }

    return compressedFilePath;
  } catch (err: unknown) {
    console.error(
      `Error compressing ${databaseName}: ${(err as Error).message}`
    );
    Print.error(`Error compressing ${databaseName}`);
    return "";
  }
};

const backupHelper = async (data: ConfigType): Promise<DumpInfo | null> => {
  const dumps: DumpType[] = [] as DumpType[];
  let errorMsg: string | null = null;

  switch (data.type) {
    case "mysql":
      // NOTE: mutating the dumps array
      handleMysqlDump(data, dumps);
      break;
    case "postgres":
      // NOTE: mutating the dumps array
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
        handleDumpError(err.message, databaseName, dumpFilePath);
        reject(new Error(`Cannot backup ${databaseName}`));
      });

      dumpedContent.on("close", async (code: number) => {
        if (code !== 0 || errorMsg) {
          handleDumpFailure(code, errorMsg, databaseName, dumpFilePath);
          reject(new Error(`Cannot backup ${databaseName}`));
          return;
        }

        console.log(`Backup of ${databaseName} completed successfully`);
        const compressedFilePath = await finalizeBackup(
          dumpFilePath,
          databaseName
        );
        if (compressedFilePath) {
          // Remove locally created dump files.
          console.log(`Removing dump file.. ${dumpFilePath}`);
          rmSync(dumpFilePath);
          rmSync(`${dumpFilePath}.zip`);

          resolve({
            databaseName,
            compressedFilePath,
            databaseType: data.type,
            dumpFilePath,
            dumpFileName,
          });
        } else {
          reject(new Error(`Error compressing ${databaseName}`));
        }
      });
    });
  });
};

export default backupHelper;
