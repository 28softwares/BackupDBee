import { NotifyOnMedium } from "../@types/types";
import Print from "../constants/Print";
import EnvConfig from "../constants/env.config";
import { DiscordNotifier } from "../notifiers/DiscordNotifier";
import { Notifier, NotifierOption } from "../notifiers/Notifier";
import { SlackNotifier } from "../notifiers/SlackNotifier";

export const notify = async (
  notify_on: NotifyOnMedium[],
  option: NotifierOption
) => {
  const notifiers: Notifier[] = [];
  for (const medium of notify_on) {
    switch (medium) {
      case "SLACK":
        const webHookURL = EnvConfig.SLACK_WEBHOOK_URL!; // eslint-disable-line
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
