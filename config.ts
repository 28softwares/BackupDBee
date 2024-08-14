/* eslint-disable no-undef */
import "dotenv/config";
import { ConfigType } from "./src/types";

  const dbConfig:ConfigType[]   = [
    {
      host: process.env.HOST,
      db_name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: 5432,
      ssl: false,
      type: "postgres",
    },
    {
      host: process.env.MYSQL_HOST,
      db_name: process.env.MYSQL_DB_NAME,
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      port: 3306,
      ssl: false,
      type: "mysql",
    },
  ];

export default dbConfig;
