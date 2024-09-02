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
