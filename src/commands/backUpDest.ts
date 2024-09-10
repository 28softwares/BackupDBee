import { select, text } from "@clack/prompts";
import { saveConfigToEnv } from "./envWriter";
import { promptWithCancel } from "./promptWithCancel";

type Config = {
  backupDestination: string | symbol;
  mailUsername?: string | symbol;
  mailPassword?: string | symbol;
  bucketName?: string | symbol;
  accesskey?: string | symbol;
  secretKey?: string | symbol;
  region?: string | symbol;
};

const backUpDest = async () => {
  const config: Config = {
    backupDestination: await promptWithCancel(select, {
      message: "Select a backup destination",
      options: [
        { label: "Gmail", value: "GMAIL" },
        { label: "Aws s3 Bucket", value: "S3_BUCKET" },
        { label: "None", value: "NONE" },
      ],
      initialValue: "GMAIL",
    }),
  };

  if (config.backupDestination === "GMAIL") {
    Object.assign(config, {
      mailUsername: await promptWithCancel(text, {
        message: "Enter your Gmail",
      }),
      mailPassword: await promptWithCancel(text, {
        message: "Enter Gmail password",
      }),
    });
  } else if (config.backupDestination === "S3_BUCKET") {
    Object.assign(config, {
      bucketName: await promptWithCancel(text, {
        message: "Enter AWS S3 bucket name",
      }),
      accesskey: await promptWithCancel(text, {
        message: "Enter AWS S3 access key",
      }),
      secretKey: await promptWithCancel(text, {
        message: "Enter AWS S3 secret key",
      }),
      region: await promptWithCancel(text, { message: "Enter AWS S3 region" }),
    });
  }

  // Only pass defined values to the env writer
  const envConfig = {
    BACKUP_DEST: config.backupDestination,
    ...(config.mailUsername && { MAIL_USER: config.mailUsername }),
    ...(config.mailPassword && { MAIL_PASSWORD: config.mailPassword }),
    ...(config.bucketName && { AWS_S3_BUCKET_NAME: config.bucketName }),
    ...(config.accesskey && { AWS_ACCESS_KEY_ID: config.accesskey }),
    ...(config.secretKey && { AWS_SECRET_ACCESS_KEY: config.secretKey }),
    ...(config.region && { AWS_REGION: config.region }),
  };

  saveConfigToEnv(envConfig);
};

export default backUpDest;
