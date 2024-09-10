import { checkbox, input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs";
import { Command } from "commander";
import process from "process";
import { execSync } from "child_process";


const createFile=(filename) =>{
  fs.open(filename,'r',function(err){
    if (err) {
      fs.writeFile(filename, '', function(err) {
          if(err) {
              console.log(err);
          }
      });
    } 
  });
}
const findAndReplace = (filename, searchString, newString) => {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    const lines = data.split("\n");
    let modified = false;

    const updatedLines = lines.map((line) => {
      if (line.includes(searchString)) {
        modified = true;
        return newString; // Replace the line with new data
      }
      return line;
    });

    // If the search string was not found, append the new line at the end
    if (!modified) {
      updatedLines.push(newString);
    }

    // Join the lines back into a single string
    const updatedData = updatedLines.join("\n");

    // Write the modified content back to the file
    fs.writeFile(filename, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing the file:", err);
      }
      // else if (modified) {
      //   console.log("File updated successfully.");
      // } else {
      //   console.log(
      //     "Search string not found. New line added to the end of the file."
      //   );
      // }
    });
  });
};

const updateGmailVariables = async () => {
  const username = await input({
    message: "Enter gmail username:",
    theme: answerTheme,
  });
  findAndReplace(".env", "MAIL_USER", `MAIL_USER=${username}`);
  const mail_password = await password({
    message: "Enter gmail password:",
    theme: answerTheme,
  });
  findAndReplace(".env", "MAIL_PASSWORD", `MAIL_PASSWORD=${mail_password}`);
};

const updateAwsVariables = async () => {
  const bucketName = await input({
    message: "Enter aws s3 bucket name:",
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    "AWS_S3_BUCKET_NAME",
    `AWS_S3_BUCKET_NAME=${bucketName}`
  );
  const accesskey = await input({
    message: "Enter aws s3 accesskey:",
    theme: answerTheme,
  });
  findAndReplace(".env", "AWS_ACCESS_KEY_ID", `AWS_ACCESS_KEY_ID=${accesskey}`);
  const secretKey = await password({
    message: "Enter aws s3 bucket secret key:",
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    "AWS_SECRET_ACCESS_KEY",
    `AWS_SECRET_ACCESS_KEY=${secretKey}`
  );
};

const selectBackupDestination = async () => {
  const backupDestination = await checkbox({
    message: chalk.magenta.underline("Select a package manager"),
    theme: {
      prefix: chalk.greenBright("$"),
    },
    choices: [
      { name: "Gmail", value: "GMAIL" },
      { name: "Aws s3 Bucket", value: "S3_BUCKET" },
      {
        name: "None",
        value: "NONE",
        description: "Save database to local storage only.",
      },
    ],
    validate: (selected) => {
      if (selected.length === 0) {
        return "Please select at least one option.";
      }

      if (selected.length === 3) {
        return "You cannot select Gmail, AWS, and None at the same time.";
      }
      const none = selected.find((item) => item.value === "NONE");
      if (none && selected.length > 1) {
        return "You cannot select other option with none";
      }

      return true;
    },
  });
  return backupDestination;
};

const setBackupDestination = async () => {
  const backupDestination = await selectBackupDestination();
  if (backupDestination.includes("NONE")) {
    findAndReplace(".env", "BACKUP_DEST", "BACKUP_DEST=NONE");
  } else if (
    backupDestination.includes("GMAIL") &&
    backupDestination.includes("S3_BUCKET")
  ) {
    await updateGmailVariables();
    await updateAwsVariables();
    findAndReplace(".env", "BACKUP_DEST", "BACKUP_DEST=S3_BUCKET,GMAIL");
  } else if (backupDestination.includes("GMAIL")) {
    findAndReplace(".env", "BACKUP_DEST", "BACKUP_DEST=GMAIL");
    updateGmailVariables();
  } else if (backupDestination.includes("S3_BUCKET")) {
    findAndReplace(".env", "BACKUP_DEST", "BACKUP_DEST=S3_BUCKET");
    updateAwsVariables();
  } else {
    findAndReplace(".env", "BACKUP_DEST", "BACKUP_DEST=NONE");
  }
};

const updateWebhookUrl = async (destination) => {
  const webhookUrl = await input({
    theme: answerTheme,
    message: `Enter ${destination.toLowerCase()} webhook url:`,
  });
  findAndReplace(
    ".env",
    `${destination}_WEBHOOK_URL`,
    `${destination}_WEBHOOK_URL=${webhookUrl}`
  );
};

const selectNotificationDestination = async () => {
  const notificationDestination = await checkbox({
    message: chalk.magenta.underline("Select notification service"),
    theme: {
      prefix: chalk.greenBright("$"),
    },
    choices: [
      { name: "Discord", value: "DISCORD" },
      { name: "Slack", value: "SLACK" },
      { name: "Custom", value: "CUSTOM" },
      {
        name: "None",
        value: "NONE",
        description: "No notification will be sent",
      },
    ],
    validate: function (selected) {
      if (selected.length === 0) {
        return "Please select at least one option.";
      }
      if (selected.length === 4) {
        return "You cannot select Discord, Slack, Custom and None at the same time.";
      }
      const none = selected.find((item) => item.value === "NONE");

      if (none && selected.length > 1) {
        return "You cannot select other option with none";
      }

      return true;
    },
  });
  return notificationDestination;
};

const setNotificationDestination = async () => {
  const notificationDestination = await selectNotificationDestination();
  if (notificationDestination.includes("NONE")) {
    findAndReplace(".env", "BACKUP_NOTIFICATION", "BACKUP_NOTIFICATION=NONE");
  } else if (
    notificationDestination.includes("DISCORD") &&
    notificationDestination.includes("SLACK") &&
    notificationDestination.includes("CUSTOM")
  ) {
    findAndReplace(
      ".env",
      "BACKUP_NOTIFICATION",
      "BACKUP_NOTIFICATION=SLACK,DISCORD,CUSTOM"
    );
    await updateWebhookUrl("DISCORD");
    await updateWebhookUrl("SLACK");
    await updateWebhookUrl("CUSTOM");
  } else if (
    notificationDestination.includes("DISCORD") &&
    notificationDestination.includes("SLACK")
  ) {
    findAndReplace(
      ".env",
      "BACKUP_NOTIFICATION",
      "BACKUP_NOTIFICATION=DISCORD,SLACK"
    );
    await updateWebhookUrl("DISCORD");
    await updateWebhookUrl("SLACK");
  } else if (notificationDestination.includes("SLACK")) {
    findAndReplace(".env", "BACKUP_NOTIFICATION", "BACKUP_NOTIFICATION=SLACK");
    await updateWebhookUrl("SLACK");
  } else if (notificationDestination.includes("DISCORD")) {
    findAndReplace(
      ".env",
      "BACKUP_NOTIFICATION",
      "BACKUP_NOTIFICATION=DISCORD"
    );
    await updateWebhookUrl("DISCORD");
  } else if (notificationDestination.includes("CUSTOM")) {
    findAndReplace(".env", "BACKUP_NOTIFICATION", "BACKUP_NOTIFICATION=CUSTOM");
    await updateWebhookUrl("CUSTOM");
  } else {
    findAndReplace(".env", "BACKUP_NOTIFICATION", "BACKUP_NOTIFICATION=NONE");
  }
};

const selectDatabase = async () => {
  const database = await select({
    message: chalk.magenta.underline("Add new database"),
    theme: {
      prefix: chalk.greenBright("$")
    },
    choices: [
      { name: "Postgres", value: "POSTGRES" },
      { name: "MySQl", value: "MYSQL" },
      { name: "Both", value: "BOTH" },
    ],
    validate: (selected) => {
      if (selected.length === 0) {
        return "Please select at least one option.";
      }
      return true;
    },
  });
  return database;
};

const addDatabaseVariables = async (databaseType) => {
  const hostName = await input({
    message: `Enter your ${databaseType.toLowerCase()} hostname:`,
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    `${databaseType}_HOST`,
    `${databaseType}_HOST=${hostName}`
  );
  const dbName = await input({
    message: `Enter your ${databaseType.toLowerCase()} database name:`,
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    `${databaseType}_DB_NAME`,
    `${databaseType}_DB_NAME=${dbName}`
  );
  const dbUsername = await input({
    message: `Enter your ${databaseType.toLowerCase()} database username:`,
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    `${databaseType}_DB_USER`,
    `${databaseType}_DB_USER=${dbUsername}`
  );
  const dbPassword = await input({
    message: `Enter your ${databaseType.toLowerCase()} database password:`,
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    `${databaseType}_DB_PASSWORD`,
    `${databaseType}_DB_PASSWORD=${dbPassword}`
  );
  const dbPort = await input({
    message: `Enter your ${databaseType.toLowerCase()} database port:`,
    theme: answerTheme,
  });
  findAndReplace(
    ".env",
    `${databaseType}_DB_PORT`,
    `${databaseType}_DB_PORT=${dbPort}`
  );
};


const addDatabase = async (databaseType) => {
  if (databaseType === "BOTH") {
    await addDatabaseVariables("POSTGRES");
    await addDatabaseVariables("MYSQL");
  }else if (databaseType === "MYSQL") {
    await addDatabaseVariables("MYSQL");
  } else {
    await addDatabaseVariables("POSTGRES");
  }
};

const answerTheme = {
  prefix: chalk.greenBright(">>>>"),
};

const verifyDependency = () => {
  const commands = ["zip", "pg_dump", "mysqldump", "pnpm", "node"];
  commands.forEach((cmd) => {
    try {
      execSync(`${cmd} --version`);
      console.log(chalk.green(`${cmd}already installed`));
    } catch (error) {
      console.log(chalk.red(error.message));
      console.log(chalk.red(`${cmd} command not found!`));
      process.exit(1);
    }
  });
};

const program = new Command();

program
  .option("--v, --verify", "Verify required dependency")
  .option("--run, --run_backup", "Run backup")
  .option("--cron,--corn-schedule", "Cron schedule (default:once per day) (format:0 0 * * *)")
  .option(
    "--g ,--generate",
    "Generate .env file settings required environmental variables"
  )
  // Update env variables
  .option("--update-pg, --update_postgres_database", "Update Postgres database credentials")
  .option("--update-sql, --update_mysql_database", "update MySQL database credentials")
  .option("--ug, --update_gmail", "Update gmail credential")
  .option("--ud, --update_discord", "Update discord webhook url")
  .option("--us, --update_slack", "Update slack webhook url")
  .option("--uc, --update_custom", "Update custom webhook url")
 

program.parse(process.argv);

const options = program.opts();

const runCli = async () => {
  if (!fs.existsSync(".env")) {
    console.log(chalk.red("Environment variables file not found!"));
    console.log(chalk.red("Please run 'node index.mjs --generate'"));
    process.exit(1);
  }
  if (options.run_backup) {
    execSync(`pnpm start`)
    console.log(chalk.green(`[+] Backup successful and stored inside 'backups' directory`))
  }
  if (options.corn_schedule){
    const cronSchedule = "0 0 * * *"; // Default: once per day

    execSync(`pm2 start run-ts.sh  --name dbbackup --cron "${cronSchedule}"`);
    execSync("pm2 save");

    console.log(
      chalk.green(`Cron job scheduled with expression: ${cronSchedule}`)
    );
  } 

  if (options.generate) {
    await createFile('.env')
    await addDatabase(await selectDatabase());
    await setBackupDestination();
    await setNotificationDestination();
  }
  if (options.verify) {
    await verifyDependency();
  }
  if (options.update_gmail) {
    await updateGmailVariables();
  }
  if (options.update_discord) {
    await updateWebhookUrl("DISCORD");
  }
  if (options.update_custom) {
    await updateWebhookUrl("CUSTOM");
  }
  if (options.update_slack) {
    await updateWebhookUrl("SLACK");
  }
  if (options.update_postgres_database) {
    await addDatabase('POSTGRES')
  }
  if (options.update_mysql_database) {
    await addDatabase('MYSQL')
  }
};

runCli();
