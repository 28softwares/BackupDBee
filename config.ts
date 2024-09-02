/* eslint-disable no-undef */
import "dotenv/config";
import { ConfigType } from "./src/@types/types";
import EnvConfig from "./src/constants/env.config";

const dbConfig: ConfigType[] = [
  {
    host: EnvConfig.POSTGRES_DB_HOST,
    db_name: EnvConfig.POSTGRES_DB_NAME,
    user: EnvConfig.POSTGRES_DB_USER,
    password: EnvConfig.POSTGRES_DB_PASSWORD,
    backupDest: EnvConfig.BACKUP_DEST,
    type: "postgres",
    notify_on: ["SLACK"]
  },
  // add multiple databases here
];

export default dbConfig;
