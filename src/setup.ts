import { DataBeeConfig, Destinations, Notifications } from "./@types/config";
import { ConfigType } from "./@types/types";
import Log from "./constants/log";
import {
  validateEmailDestination,
  validateLocalDestination,
  validateS3Destination,
} from "./validators/destination";

import {
  validateDiscordNotification,
  validateSlackNotification,
  validateTelegramNotification,
  validateWebhookNotification,
  validateEmailNotification,
} from "./validators/notification";

export function getDefaultPortOfDBType(type: string): number {
  switch (type) {
    case "postgres":
      return 5432;
    case "mysql":
      return 3306;
    default:
      return 0;
  }
}

export function setupDBConfig(dataBeeConfig: DataBeeConfig): ConfigType[] {
  if (dataBeeConfig.databases.length === 0) {
    Log.error("No database configurations found in the config file.");
  }

  const configs = dataBeeConfig.databases.map((db) => {
    return {
      host: db.host,
      db_name: db.database_name,
      user: db.username,
      password: db.password,
      type: db.type,
      port: db.port || getDefaultPortOfDBType(db.type),
    } as ConfigType;
  });
  return configs;
}

export function setupDestinations(dataBeeConfig: DataBeeConfig): Destinations {
  if (
    !dataBeeConfig?.destinations?.email?.enabled &&
    !dataBeeConfig?.destinations?.s3_bucket?.enabled &&
    !dataBeeConfig?.destinations?.local?.enabled
  ) {
    Log.error("No destination enabled in the config file.");
    return {} as Destinations;
  }
  const destinations: Destinations = {
    email: {
      enabled: false,
    },
    s3_bucket: {
      enabled: false,
    },
    local: {
      enabled: false,
    },
  } as Destinations;
  if (dataBeeConfig?.destinations?.email?.enabled) {
    if (validateEmailDestination(dataBeeConfig?.destinations?.email)) {
      destinations.email = dataBeeConfig?.destinations?.email;
    }
  }
  if (dataBeeConfig?.destinations?.s3_bucket?.enabled) {
    if (validateS3Destination(dataBeeConfig?.destinations?.s3_bucket)) {
      destinations.s3_bucket = dataBeeConfig?.destinations?.s3_bucket;
    }
  }

  if (dataBeeConfig?.destinations?.local?.enabled) {
    if (validateLocalDestination(dataBeeConfig?.destinations?.local)) {
      destinations.local = dataBeeConfig?.destinations?.local;
    }
  }
  return destinations;
}

export function setupNotifications(
  dataBeeConfig: DataBeeConfig
): Notifications {
  if (
    !dataBeeConfig?.notifications?.email?.enabled &&
    !dataBeeConfig?.notifications?.discord?.enabled &&
    !dataBeeConfig?.notifications?.slack?.enabled &&
    !dataBeeConfig?.notifications?.custom?.enabled &&
    !dataBeeConfig?.notifications?.telegram?.enabled
  ) {
    Log.error("No notifications are enabled in the config file.");
    return {} as Notifications;
  }
  const notifications: Notifications = {
    email: {
      enabled: false,
    },
    discord: {
      enabled: false,
    },
    slack: {
      enabled: false,
    },
    custom: {
      enabled: false,
    },
    telegram: {
      enabled: false,
    },
  } as Notifications;

  if (dataBeeConfig?.notifications?.email?.enabled) {
    if (validateEmailNotification(dataBeeConfig?.notifications?.email)) {
      notifications.email = dataBeeConfig?.notifications?.email;
    }
  }
  if (dataBeeConfig?.notifications?.discord?.enabled) {
    if (
      validateDiscordNotification(
        dataBeeConfig?.notifications?.discord?.webhook_url
      )
    ) {
      notifications.discord = dataBeeConfig?.notifications?.discord;
    }
  }

  if (dataBeeConfig?.notifications?.slack?.enabled) {
    if (
      validateSlackNotification(
        dataBeeConfig?.notifications?.slack?.webhook_url
      )
    ) {
      notifications.slack = dataBeeConfig?.notifications?.slack;
    }
  }

  if (dataBeeConfig?.notifications?.custom?.enabled) {
    if (
      validateWebhookNotification(
        dataBeeConfig?.notifications?.custom?.webhook_url
      )
    ) {
      notifications.custom = dataBeeConfig?.notifications?.custom;
    }
  }

  if (dataBeeConfig?.notifications?.telegram?.enabled) {
    if (
      validateTelegramNotification(
        dataBeeConfig?.notifications?.telegram.web_hook,
        dataBeeConfig?.notifications?.telegram.web_hook_secret
      )
    ) {
      notifications.telegram = dataBeeConfig?.notifications?.telegram;
    }
  }

  return notifications;
}
