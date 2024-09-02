/* eslint-disable no-undef */
import "dotenv/config";

export type BackupDest = "GMAIL" | undefined;

class EnvConfig {
  // MAIL
  public static MAIL_USER = process.env.MAIL_USER as string;
  public static MAIL_PASSWORD = process.env.MAIL_PASSWORD as string;

  //BACKUP_CONFIG
  public static BACKUP_DEST = process.env.BACKUP_DEST as BackupDest;

  //  POSTGRES DATABASE CONFIGURATION
  public static POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST as string;
  public static POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME as string;
  public static POSTGRES_DB_USER = process.env.POSTGRES_DB_USER as string;
  public static POSTGRES_DB_PASSWORD = process.env
    .POSTGRES_DB_PASSWORD as string;

  //  MYSQL DATABASE CONFIGURATION
  public static MYSQL_DB_HOST = process.env.MYSQL_DB_HOST as string;
  public static MYSQL_DB_NAME = process.env.MYSQL_DB_NAME as string;
  public static MYSQL_DB_USER = process.env.MYSQL_DB_USER as string;
  public static MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD as string;

  // DISCORD CONFIGURATION
  public static BACKUP_NOTIFICATION = process.env.BACKUP_NOTIFICATION as string;
  public static DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL as string;

  // SLACK CONFIGURATION
  public static SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL as string;
}

export default EnvConfig;
