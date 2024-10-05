import { S3Bucket } from "../@types/config";
import { config } from "../utils/cli.utils";
import Log from "../constants/log";

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
