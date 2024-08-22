export type ConfigType = {
  host: string | undefined;
  db_name: string | undefined;
  user: string | undefined;
  password: string | undefined;
  type: "postgres" | "mysql";
  port?: number;
  ssl?: boolean;
  mail_backup?: boolean;
};
