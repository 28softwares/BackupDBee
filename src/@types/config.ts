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

export interface Email {
  enabled: boolean;
  from: string;
  to: string[];
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
  web_hook: string;
  web_hook_secret: string;
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
  bucket: string;
  region: string;
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
