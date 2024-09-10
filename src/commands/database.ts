import { isCancel, select, text, confirm } from "@clack/prompts";
import process from "process";
import * as fs from "fs";
import * as path from "path";
import { promptWithCancel } from "./promptWithCancel";

type Config = {
  dbType: string | symbol;
  host?: string | symbol;
  username?: string | symbol;
  password?: string | symbol;
  dbname?: string | symbol;
  port?: string | symbol;
};

const database = async () => {
  let wantToAddDatabase = true;
  do {
    const config: Config = {
      dbType: await promptWithCancel(select, {
        message: "Choose database type",
        options: [
          {
            name: "Postgres",
            value: "POSTGRES",
          },
          {
            name: "MySQL",
            value: "MYSQL",
          },
        ],
        initialValue: "POSTGRES",
      }),
    };

    if (isCancel(config.dbType)) {
      console.log("Operation cancelled");
      process.exit(0);
    }

    Object.assign(config, {
      host: await text({ message: "Enter db host" }),
      username: await text({ message: "Enter db username" }),
      password: await text({ message: "Enter db password" }),
      dbname: await text({ message: "Enter db name" }),
      port: await text({ message: "Enter db port" }),
    });

    // Construct the new entry for the dbConfig array
    const newEntry = `
    {
      host: "${String(config.host)}",
      db_name: "${String(config.dbname)}",
      user: "${String(config.username)}",
      password: "${String(config.password)}",
      type: "${config.dbType.toLowerCase()}",
      port: ${Number(config.port)}
    },
    `;

    // eslint-disable-next-line no-undef
    const dbConfigFile = path.join(__dirname, "../../config.ts"); // Adjust path to the root folder

    if (!fs.existsSync(dbConfigFile)) {
      // If it doesn't exist, create a new one with the proper structure
      const fileContent = `
  import { ConfigType } from "./src/@types/types";
  
  const dbConfig: ConfigType[] = [
  ${newEntry}
  // add multiple databases here
  ];
  
  export default dbConfig;
  `;

      fs.writeFileSync(dbConfigFile, fileContent);
    } else {
      // If it exists, append the new config entry before the comment
      const fileContent = fs.readFileSync(dbConfigFile, "utf-8");
      const updatedContent = fileContent.replace(
        "// add multiple databases here",
        `${newEntry}  // add multiple databases here`
      );
      fs.writeFileSync(dbConfigFile, updatedContent);
    }
    wantToAddDatabase = Boolean(
      await confirm({
        message: "Do you want to add another database?",
        initialValue: true,
      })
    );
  } while (wantToAddDatabase);
};

export default database;
