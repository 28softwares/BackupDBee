import { Email, Local, S3Bucket } from "../@types/config";
import Log from "../constants/log";
import { config } from "../utils/cli.utils";

export function validateLocalDestination(local: Local): boolean {
  if (local?.enabled) {
    if (!local?.path) {
      console.error("Local path not set in the config file.");
      return false;
    }
  }
  return true;
}

export function validateEmailDestination(email?: Email): boolean {
  if (email?.enabled) {
    if (!email?.from) {
      Log.error("Email from address not set in the config file.");
      return false;
    }

    if (!email?.to?.length) {
      Log.error("Email to address not set in the config file.");
      return false;
    }

    if (
      !config.destinations.email.smtp_username ||
      !config.destinations.email.smtp_password
    ) {
      Log.error("Mail credentials not set in the environment variables.");
      return false;
    }
  }
  return true;
}

export function validateS3Destination(s3_bucket: S3Bucket): boolean {
  if (s3_bucket?.enabled) {
    if (!s3_bucket?.bucket_name) {
      Log.error("S3 bucket name not set in the config file.");
      return false;
    }

    if (!s3_bucket?.region) {
      Log.error("S3 region not set in the config file.");
      return false;
    }

    if (
      !config.destinations.s3_bucket.access_key ||
      !config.destinations.s3_bucket.secret_key ||
      !config.destinations.s3_bucket.region
    ) {
      Log.error("AWS credentials not set in the environment variables.");
      return false;
    }
  }
  return true;
}
