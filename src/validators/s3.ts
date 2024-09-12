import { S3Bucket } from "../@types/config";
import EnvConfig from "../constants/env.config";
import Log from "../constants/log";

export function validateS3Destination(s3_bucket: S3Bucket): boolean {
  if (s3_bucket?.enabled) {
    if (!s3_bucket?.bucket) {
      Log.error("S3 bucket name not set in the config file.");
      return false;
    }

    if (!s3_bucket?.region) {
      Log.error("S3 region not set in the config file.");
      return false;
    }

    if (!EnvConfig.AWS_ACCESS_KEY_ID || !EnvConfig.AWS_SECRET_ACCESS_KEY || !EnvConfig.AWS_REGION) {
      Log.error("AWS credentials not set in the environment variables.");
      return false;
    }
  }
  return true;
}
