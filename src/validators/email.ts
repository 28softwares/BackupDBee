import { Email } from "../@types/config";
import Log from "../constants/log";
import { config } from "../utils/cli.utils";

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

export function validateEmailNotification(email: Email): boolean {
  if (!email.from) {
    Log.error("Email from address not set in the config file.");
    return false;
  }

  if (!email.to.length) {
    Log.error("Email to address not set in the config file.");
    return false;
  }

  return true;
}
