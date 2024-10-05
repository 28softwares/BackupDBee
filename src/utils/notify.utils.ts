import { DumpInfo } from "../@types/types";
import Log from "../constants/log";
import { CustomNotifier } from "../notifiers/custom_notifier";
import { Notifier } from "../notifiers/notifier";
import { SlackNotifier } from "../notifiers/slack_notifier";
import { DiscordNotifier } from "../notifiers/discord_notifier";
import { Notifications } from "../@types/config";
import { NOTIFICATION } from "../constants/notifications";
import { TelegramNotifier } from "../notifiers/telegram_notifier";

export const sendNotification = async (
  dumpInfo: DumpInfo,
  notifications: Notifications
) => {
  const notify_on = Object.keys(notifications)
    .filter((key) => notifications[key as keyof Notifications].enabled)
    .map((key) => key as keyof Notifications);

  const notifiers: Notifier[] = [];
  const message = `Backup completed successfully for database: ${
    dumpInfo.databaseName
  } at ${new Date()}`;
  for (const medium of notify_on) {
    switch (medium.trim().toUpperCase()) {
      case NOTIFICATION.SLACK:
        notifiers.push(
          new SlackNotifier(notifications.slack.webhook_url, message)
        );
        break;
      case NOTIFICATION.DISCORD:
        notifiers.push(
          new DiscordNotifier(notifications.discord.webhook_url, message)
        );
        break;
      case NOTIFICATION.CUSTOM:
        notifiers.push(
          new CustomNotifier(notifications.custom.webhook_url, message)
        );
        break;
      case NOTIFICATION.TELEGRAM:
        notifiers.push(
          new TelegramNotifier(
            notifications.telegram.webhook_url,
            message,
            notifications.telegram.chatId
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
      try {
        notifier.validate();
        await notifier.notify();
      } catch (error: unknown) {
        if (error instanceof Error) {
          Log.error(`Validation or notification Error: ${error.message}`);
          console.error(
            `[-] Validation or notification Error: ${error.message}`
          );
        } else {
          Log.error(`Unknown error occurred.`);
          console.error(`[-] Unknown error occurred.`);
        }
      }
    }
  };
}
