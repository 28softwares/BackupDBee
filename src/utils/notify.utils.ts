import Log from "../constants/Log";
import EnvConfig from "../constants/env.config";
import { NotifierOption } from "../notifiers/Notifier";
import { WebhookNotifier } from "../notifiers/WebhookNotifier";

export const sendNotification = async (
  option: NotifierOption
) => {
  const myArray = EnvConfig.WEBHOOK_URL?.split(",") || [];
  
  for (const webhook of myArray) {
    try {
      const notifier = new WebhookNotifier(webhook).withMessage(`[+] Backup created for ${option.databaseName} database.`);
      notifier.notify()
    } catch(error) {
      Log.error("Notifier failed to send notification")
      console.log("Notifier failed to send notification",error)
      throw error;
    }
  }
};
