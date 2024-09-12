import { DataBeeConfig, Destinations } from "./@types/config";
import { ConfigType } from "./@types/types";
import Log from "./constants/log";
import { validateLocalDestination } from "./validators/destination";
import { validateEmailDestination } from "./validators/email";
import { validateS3Destination } from "./validators/s3";

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
