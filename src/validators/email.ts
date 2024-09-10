import { Email } from "../@types/config";
import EnvConfig from "../constants/env.config";
import Log from "../constants/log";

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

    if (!EnvConfig.MAIL_USER || !EnvConfig.MAIL_PASSWORD) {
      Log.error("Mail credentials not set in the environment variables.");
      return false;
    }
  }
  return true;
}
