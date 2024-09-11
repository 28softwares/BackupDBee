import { intro, outro } from "@clack/prompts";
import chalk from "chalk";
import * as fs from "fs";
import process from "process";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const updateHelper = async (updateType: string, action: Function) => {
  //check .env file exists in root folder
  if (!fs.existsSync(".env")) {
    console.log(chalk.red("Please create .env file first!"));
    console.log(
      chalk.blue("Run 'ts-node index.ts install' to create .env file using cli")
    );
    process.exit(1);
  }
  intro(chalk.inverse(updateType));
  await action();
  outro(chalk.green(`${updateType} successfully!`));
};

export default updateHelper;
