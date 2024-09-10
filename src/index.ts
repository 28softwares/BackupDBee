import backupHelper from "./utils/backup.utils";
import { exec } from "child_process";
import { ConfigType } from "./@types/types";
import { promisify } from "util";
import Log from "./constants/log";
// import { sendNotification } from "./utils/notify.utils";
import { readFileSync } from "fs";
import * as yaml from "yaml";
import { DataBeeConfig, Destinations } from "./@types/config";
import { validateEmailDestination } from "./validators/email";
import { validateS3Destination } from "./validators/s3";
import { validateLocalDestination } from "./validators/destination";
// Promisify exec to use with async/await
export const execAsync = promisify(exec);

function validateDBConfig(config: ConfigType): boolean {
  let isValid = true;
  if (!config.host) {
    isValid = false;
    Log.error("Host is not set in the config file.");
  }

  if (!config.db_name) {
    isValid = false;
    Log.error("Database name is not set in the config file.");
  }

  if (!config.user) {
    isValid = false;
    Log.error("Username is not set in the config file.");
  }

  if (!config.password) {
    isValid = false;
    Log.error("Password is not set in the config file.");
  }

  if (!config.type) {
    isValid = false;
    Log.error("Database type is not set in the config file.");
  }

  if (config.type !== "postgres" && config.type !== "mysql") {
    isValid = false;
    Log.error(
      "Unsupported database type. Supported types are postgres and mysql."
    );
  }

  if (!config.port) {
    Log.warn(
      `Port is not set in the config file. Using default port for ${config.type}`
    );
    config.port = getDefaultPortOfDBType(config.type);
  }

  return isValid;
}

const main = async (configs: ConfigType[], destinations: Destinations) => {
  for (const config of configs) {
    // if no config provided, then only backup will be done
    if (validateDBConfig(config)) {
      try {
        const dumpInfo = await backupHelper(config, destinations);
        if (!dumpInfo) {
          Log.error("Backup failed.");
          return;
        }

        // await sendNotification(EnvConfig.BACKUP_NOTIFICATION, {
        //   databaseName: dumpInfo.databaseName,
        // });
      } catch (e: unknown) {
        Log.error("Backup failed." + e);
      }
    }
  }
};

function parseConfigFile(path: string = "config.yaml"): DataBeeConfig {
  const configFile = readFileSync(path, "utf-8");
  const yamlConfig = yaml.parse(configFile) as DataBeeConfig;
  return yamlConfig;
}

function getDefaultPortOfDBType(type: string): number {
  switch (type) {
    case "postgres":
      return 5432;
    case "mysql":
      return 3306;
    default:
      return 0;
  }
}

function setupDBConfig(dataBeeConfig: DataBeeConfig): ConfigType[] {
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

function setupDestinations(dataBeeConfig: DataBeeConfig): Destinations {
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

const dataBeeConfig = parseConfigFile();
main(setupDBConfig(dataBeeConfig), setupDestinations(dataBeeConfig));
