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
    mail_backup: false,
    type: "postgres",
  },
  {
    host: process.env.MYSQL_HOST,
    db_name: process.env.MYSQL_DB_NAME,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    type: "mysql",
  },
  // add multiple databases here
];

export default dbConfig;
