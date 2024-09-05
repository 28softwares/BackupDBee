#!/usr/bin/env node

import process from "process";
import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import cron from "node-cron";

const program = new Command();
program.version("1.0.0").description("AutoBackup DB CLI");

program
  .command("install")
  .alias("i")
  .description(
    "Check required commands, create .env file and install dependencies"
  )
  .action(async () => {
    const commands = ["zip", "pg_dump", "mysqldump", "pnpm", "node"];

    commands.forEach((command) => {
      try {
        execSync(`${command} --version`);
      } catch (error) {
        console.log(chalk.red(error.message));
        console.log(chalk.red(`${command} command not found!`));
        process.exit(1);
      }
    });

    let backupOption = "";
    let mailUser = "";
    let mailPass = "";
    let bucketName = "";
    let accessKey = "";
    let secretKey = "";
    let region = "";
    let backupNotification = "";
    let slackWebhook = "";
    let discordWebhook = "";
    let databaseType = "";
    let postgresHost = "";
    let postgresDbName = "";
    let postgresDbUser = "";
    let postgresDbPassword = "";
    let mysqlHost = "";
    let mysqlDbName = "";
    let mysqlDbUser = "";
    let mysqlDbPassword = "";

    backupOption = await select({
      message: "Please choose a backup option:",
      choices: [
        {
          name: "Gmail",
          value: "GMAIL",
        },
        {
          name: "S3 Bucket",
          value: "S3_BUCKET",
        },
      ],
    });
    if (backupOption === "GMAIL") {
      mailUser = await input({ message: "Enter your email:" });
      mailPass = await input({ message: "Enter your password:" });
    } else if (backupOption === "S3_BUCKET") {
      bucketName = await input({ message: "Enter your aws bucket name:" });
      accessKey = await input({
        message: "Enter your aws access key id:",
      });
      secretKey = await input({
        message: "Enter your aws secret access key:",
      });
      region = await input({ message: "Enter your aws region:" });
    } else {
      console.log(chalk.red("Invalid option!"));
      process.exit(1);
    }

    backupNotification = await select({
      message: "Please choose a backup notification option:",
      choices: [
        {
          name: "Slack",
          value: "SLACK",
        },
        {
          name: "Discord",
          value: "DISCORD",
        },
        {
          name: "Both",
          value: "BOTH",
        },
      ],
    });

    if (backupNotification === "SLACK") {
      slackWebhook = await input({ message: "Enter slack webhook url:" });
    } else if (backupNotification === "DISCORD") {
      discordWebhook = await input({ message: "Enter discord webhook url:" });
    } else if (backupNotification === "BOTH") {
      slackWebhook = await input({ message: "Enter slack webhook url:" });
      discordWebhook = await input({ message: "Enter discord webhook url:" });
    } else {
      console.log(chalk.red("Invalid option!"));
      process.exit(1);
    }

    databaseType = await select({
      message: "Please choose a database type:",
      choices: [
        {
          name: "Postgres",
          value: "POSTGRES",
        },
        {
          name: "MySQL",
          value: "MYSQL",
        },
        {
          name: "Both",
          value: "BOTH",
        },
      ],
    });

    if (databaseType === "POSTGRES" || databaseType === "BOTH") {
      postgresHost = await input({
        message: "Enter your postgres host:",
      });
      postgresDbName = await input({
        message: "Enter your postgres database name:",
      });
      postgresDbUser = await input({
        message: "Enter your postgres database user:",
      });
      postgresDbPassword = await input({
        message: "Enter your postgres database password:",
      });
    }
    if (databaseType === "MYSQL" || databaseType === "BOTH") {
      mysqlHost = await input({ message: "Enter your mysql host:" });
      mysqlDbName = await input({
        message: "Enter your mysql database name:",
      });
      mysqlDbUser = await input({
        message: "Enter your mysql database user:",
      });
      mysqlDbPassword = await input({
        message: "Enter your mysql database password:",
      });
    }

    let envVariables = `#MAIL
MAIL_USER=${mailUser}
MAIL_PASSWORD=${mailPass}

#BACKUP_CONFIG
BACKUP_DEST=${backupOption}
BACKUP_NOTIFICATION=${backupNotification}
DISCORD_WEBHOOK_URL=${discordWebhook}
SLACK_WEBHOOK_URL=${slackWebhook}

# POSTGRES DATABASE CONFIGURATION
POSTGRES_DB_HOST=${postgresHost}
POSTGRES_DB_NAME=${postgresDbName}
POSTGRES_DB_USER=${postgresDbUser}
POSTGRES_DB_PASSWORD=${postgresDbPassword}

# MYSQL DATABASE CONFIGURATION
MYSQL_HOST=${mysqlHost}
MYSQL_DB_NAME=${mysqlDbName}
MYSQL_DB_USER=${mysqlDbUser}
MYSQL_DB_PASSWORD=${mysqlDbPassword}

# AWS S3 CONFIGURATION
AWS_S3_BUCKET_NAME=${bucketName}
AWS_ACCESS_KEY_ID=${accessKey}
AWS_SECRET_ACCESS_KEY=${secretKey}
AWS_REGION=${region}`;

    try {
      fs.writeFileSync(".env", envVariables);
      console.log(chalk.green("Environment variables written successfully!"));
    } catch (error) {
      console.log(chalk.red("Failed to write environment variables!"));
      console.log(chalk.red(error.message));
      process.exit(1);
    }

    execSync("pnpm install && pnpm start");
  });

program
  .command("update-notification-config")
  .alias("unc")
  .description("Update notification configuration")
  .action(async () => {
    // check if .env file exists
    if (!fs.existsSync(".env")) {
      console.log(chalk.red("Environment variables file not found!"));
      process.exit(1);
    }
    let backupNotification = "";
    let slackWebhook = "";
    let discordWebhook = "";

    backupNotification = await select({
      message: "Please choose a backup notification option:",
      choices: [
        {
          name: "Slack",
          value: "SLACK",
        },
        {
          name: "Discord",
          value: "DISCORD",
        },
        {
          name: "Both",
          value: "BOTH",
        },
      ],
    });

    if (backupNotification === "SLACK") {
      slackWebhook = await input({ message: "Enter slack webhook url:" });
    } else if (backupNotification === "DISCORD") {
      discordWebhook = await input({ message: "Enter discord webhook url:" });
    } else if (backupNotification === "BOTH") {
      slackWebhook = await input({ message: "Enter slack webhook url:" });
      discordWebhook = await input({ message: "Enter discord webhook url:" });
    } else {
      console.log(chalk.red("Invalid option!"));
      process.exit(1);
    }

    try {
      // first read the .env file
      let data = fs.readFileSync(".env", "utf8");
      // now we have to replace the old values with the new values
      data = data.replace(
        /BACKUP_NOTIFICATION=(.*)/g,
        `BACKUP_NOTIFICATION=${backupNotification}`
      );
      data = data.replace(
        /DISCORD_WEBHOOK_URL=(.*)/g,
        `DISCORD_WEBHOOK_URL=${discordWebhook}`
      );
      data = data.replace(
        /SLACK_WEBHOOK_URL=(.*)/g,
        `SLACK_WEBHOOK_URL=${slackWebhook}`
      );
      // now write the new data to the .env file
      fs.writeFileSync(".env", data);

      console.log(chalk.green("Environment variables updated successfully!"));
    } catch (error) {
      console.log(chalk.red("Failed to write environment variables!"));
      console.log(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command("update-backup-dest")
  .alias("ubd")
  .description("Update backup destination configuration")
  .action(async () => {
    // check if .env file exists
    if (!fs.existsSync(".env")) {
      console.log(chalk.red("Environment variables file not found!"));
      process.exit(1);
    }
    let backupOption = "";
    let mailUser = "";
    let mailPass = "";
    let bucketName = "";
    let accessKey = "";
    let secretKey = "";
    let region = "";

    backupOption = await select({
      message: "Please choose a backup option:",
      choices: [
        {
          name: "Gmail",
          value: "GMAIL",
        },
        {
          name: "S3 Bucket",
          value: "S3_BUCKET",
        },
      ],
    });
    if (backupOption === "GMAIL") {
      mailUser = await input({ message: "Enter your email:" });
      mailPass = await input({ message: "Enter your password:" });
    } else if (backupOption === "S3_BUCKET") {
      bucketName = await input({ message: "Enter your aws bucket name:" });
      accessKey = await input({
        message: "Enter your aws access key id:",
      });
      secretKey = await input({
        message: "Enter your aws secret access key:",
      });
      region = await input({ message: "Enter your aws region:" });
    } else {
      console.log(chalk.red("Invalid option!"));
      process.exit(1);
    }

    try {
      // first read the .env file
      let data = fs.readFileSync(".env", "utf8");
      // now we have to replace the old values with the new values
      data = data.replace(/BACKUP_DEST=(.*)/g, `BACKUP_DEST=${backupOption}`);
      data = data.replace(/MAIL_USER=(.*)/g, `MAIL_USER=${mailUser}`);
      data = data.replace(/MAIL_PASSWORD=(.*)/g, `MAIL_PASSWORD=${mailPass}`);
      data = data.replace(
        /AWS_S3_BUCKET_NAME=(.*)/g,
        `AWS_S3_BUCKET_NAME=${bucketName}`
      );
      data = data.replace(
        /AWS_ACCESS_KEY_ID=(.*)/g,
        `AWS_ACCESS_KEY_ID=${accessKey}`
      );
      data = data.replace(
        /AWS_SECRET_ACCESS_KEY=(.*)/g,
        `AWS_SECRET_ACCESS_KEY=${secretKey}`
      );
      data = data.replace(/AWS_REGION=(.*)/g, `AWS_REGION=${region}`);
      // now write the new data to the .env file
      fs.writeFileSync(".env", data);
    } catch (error) {
      console.log(chalk.red("Failed to write environment variables!"));
      console.log(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command("run")
  .description("Run the backup process with cron scheduling")
  .option("--cron <schedule>", "Cron schedule (default is once per day)")
  .action((cmd) => {
    // Check if .env file exists
    if (!fs.existsSync(".env")) {
      console.log(chalk.red("Environment variables file not found!"));
      console.log(chalk.red("Please run the install command first!"));
      process.exit(1);
    }
    const cronSchedule = cmd.cron || "0 0 * * *"; // Default: once per day

    execSync(
      `pm2 start src/index.mjs --name dbbackup --cron "${cronSchedule}"`
    );
    execSync("pm2 save");

    console.log(
      chalk.green(`Cron job scheduled with expression: ${cronSchedule}`)
    );
  });

program.parse(process.argv);
