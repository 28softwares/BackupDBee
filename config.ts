/* eslint-disable no-undef */
import "dotenv/config";
import { ConfigType } from "./src/types";

const dbConfig: ConfigType[] = [
  {
    host: process.env.POSTGRES_HOST,
    db_name: process.env.POSTGRES_DB_NAME,
    user: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
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
