import { ChildProcessWithoutNullStreams } from "child_process";

export type NotifyOnMedium = "SLACK" | "DISCORD";

export type ConfigType = {
  host?: string;
  db_name?: string;
  user?: string;
  password?: string;
  type: "postgres" | "mysql";
  port?: number;
  backupDest?: "GMAIL";
};

export interface DumpType {
  databaseName: string;
  dumpedContent: ChildProcessWithoutNullStreams;
}


export type DumpInfo = {
  databaseName: string;
  compressedFilePath: string;
  databaseType: string;
  dumpFilePath: string;
  dumpFileName: string;
};