export interface General {
  backup_location: string;
  log_location: string;
  log_level: string;
  retention_policy_days: number;
  backup_schedule: string;
}

export interface Notifications {
  email: Email;
  slack: Slack;
  custom: Custom;
  discord: Discord;
  telegram: Telegram;
}

export interface Slack {
  enabled: boolean;
  webhook_url: string;
}

export interface Custom {
  enabled: boolean;
  webhook_url: string;
}

export interface Discord {
  enabled: boolean;
  webhook_url: string;
}

export interface Telegram {
  enabled: boolean;
  webhook_url: string;
  chatId: number;
}

export interface Database {
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database_name: string;
  backup_schedule: string;
}

export interface Local {
  enabled: boolean;
  path: string;
}

export interface S3Bucket {
  enabled: boolean;
  bucket_name: string;
  region: string;
  access_key: string;
  secret_key: string;
}

export interface Email {
  enabled: boolean;
  smtp_server: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from: string;
  to: string[];
}

export interface Destinations {
  local: Local;
  s3_bucket: S3Bucket;
  email: Email;
}

export interface DataBeeConfig {
  general: General;
  notifications: Notifications;
  databases: Database[];
  destinations: Destinations;
}
