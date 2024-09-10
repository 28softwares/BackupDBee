import { NotifyOnMedium } from "../@types/types";
import Log from "../constants/log";
import EnvConfig from "../constants/env.config";
import { CustomNotifier } from "../notifiers/custom_notifier";
import { Notifier, NotifierOption } from "../notifiers/notifier";
import { SlackNotifier } from "../notifiers/slack_notifier";
import { DiscordNotifier } from "../notifiers/discord_notifier";

export const sendNotification = async (
  mediums: string,
  option: NotifierOption
) => {
  const notify_on = mediums.split(",") as NotifyOnMedium[];
  const notifiers: Notifier[] = [];
  const message = `Backup completed successfully for database: ${
    option.databaseName
  } at ${new Date()}`;
  for (const medium of notify_on) {
    switch (medium.trim().toUpperCase()) {
      case "SLACK":
        notifiers.push(new SlackNotifier(EnvConfig.SLACK_WEBHOOK_URL, message));
        break;
      case "DISCORD":
        notifiers.push(
          new DiscordNotifier(EnvConfig.DISCORD_WEBHOOK_URL, message)
        );
        break;
      case "CUSTOM":
        notifiers.push(
          new CustomNotifier(EnvConfig.CUSTOM_WEBHOOK_URL, message)
        );
        break;
      default:
        console.error(`[-] Unsupported notification medium: ${medium}`);
        Log.error(`Unsupported notification medium: ${medium}`);
    }
  }
  const run = notifyAllMedium(notifiers);
  run();
};

function notifyAllMedium(notifiers: Notifier[]) {
  return async () => {
    for (const notifier of notifiers) {
      try {
        notifier.validate();
        notifier.sendNotification();
      } catch (error: any) {
        Log.error(`Validation or notification error: ${error.message}`);
        console.error(`[-] Validation or notification error: ${error.message}`);
      }
    }
  };
}
