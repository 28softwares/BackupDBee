export type NotifyOnMedium = "SLACK" | "DISCORD";

export type ConfigType = {
  host?: string;
  db_name?: string;
  user?: string;
  password?: string;
  type: "postgres" | "mysql";
  port?: number;
  ssl?: boolean;
  backupDest?: "GMAIL" | "SLACK";
  mail_backup?: boolean;
  notify_on: NotifyOnMedium[];
};
