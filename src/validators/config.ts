import { ConfigType } from "../@types/types";
import Log from "../constants/log";

export function validateDBConfig(config: ConfigType): boolean {
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
    }
  
    return isValid;
  }