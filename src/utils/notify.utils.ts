import { NotifyOnMedium } from "../@types/types";
import Log from "../constants/Log";
import EnvConfig from "../constants/env.config";
import { CustomNotifier } from "../notifiers/CustomNotifier";
import { Notifier, NotifierOption } from "../notifiers/Notifier";
import { SlackNotifier } from "../notifiers/SlackNotifier";
import { DiscordNotifier } from "../notifiers/DiscordNotifier";

export const sendNotification = async (
  mediums: string,
  option: NotifierOption
) => {  
  const notify_on = mediums.split(",") as NotifyOnMedium[];
  const notifiers: Notifier[] = [];
  for (const medium of notify_on) {
    switch (medium.trim().toUpperCase()) {
      case "SLACK":
        notifiers.push(
          new SlackNotifier(EnvConfig.SLACK_WEBHOOK_URL!).withMessage(
            `Backup completed successfully for database: ${
              option.databaseName
            } at ${new Date()}`
          )
        );
        break;
      case "DISCORD":
        notifiers.push(
          new DiscordNotifier(EnvConfig.DISCORD_WEBHOOK_URL!).withMessage(
            `Backup completed successfully for database: ${
              option.databaseName
            } at ${new Date()}`
          )
        );
        break;
        case "CUSTOM":
          notifiers.push(
            new CustomNotifier(EnvConfig.CUSTOM_WEBHOOK_URL!).withMessage(
              `Backup completed successfully for database: ${
                option.databaseName
              } at ${new Date()}`
            )
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
      notifier.notify();
    }
  };
}

