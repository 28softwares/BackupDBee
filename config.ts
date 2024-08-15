/* eslint-disable no-undef */
import "dotenv/config";
import { ConfigType } from "./src/types";
const dbConfig: ConfigType[] = [
  {
    host: process.env.HOST,
    db_name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    mail_backup: false,
    type: "postgres",
  },
];

export default dbConfig;
