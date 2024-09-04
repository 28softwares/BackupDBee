import { NotifyOnMedium } from "../@types/types";
import Print from "../constants/Print";
import EnvConfig from "../constants/env.config";
import { DiscordNotifier } from "../notifiers/DiscordNotifier";
import { Notifier, NotifierOption } from "../notifiers/Notifier";
import { SlackNotifier } from "../notifiers/SlackNotifier";

export const notify = async (
  mediums: string,
  option: NotifierOption
) => {
  const notify_on = mediums.split(",") as NotifyOnMedium[];
  const notifiers: Notifier[] = [];
  const webHookURL = EnvConfig.SLACK_WEBHOOK_URL;
  for (const medium of notify_on) {
    switch (medium.trim().toUpperCase()) {
      case "SLACK":
        notifiers.push(
          new SlackNotifier(webHookURL).withMessage(
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
      default:
        console.error(`Unsupported notification medium: ${medium}`);
        Print.error(`Unsupported notification medium: ${medium}`);
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
