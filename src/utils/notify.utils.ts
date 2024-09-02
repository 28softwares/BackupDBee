import { NotifyOnMedium } from "../@types/types";
import Print from "../constants/Print";
import { Notifier, NotifierOption } from "./notifier.utils";
import { SlackNotifier } from "./slack.utils";

export async function notifyOnSlack(webhookUrl: string, message: string) {
  const slackMessage = {
    text: `AutoBackup🤖: ${message}`,
  };
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });
    console.log("Slack Notification Successfully Sent...");
  } catch (error) {
    console.error(error);
  }
}

const validateSlack = (webHookURL: string | undefined) => {
  if (!webHookURL) {
    throw new Error("SLACK_WEBHOOK_URL is not set");
  }
};

export const notify = async (
  notify_on: NotifyOnMedium[],
  option: NotifierOption
) => {
  const notifiers: Notifier[] = [];
  for (const medium of notify_on) {
    switch (medium) {
      case "SLACK":
        const webHookURL = process.env.SLACK_WEBHOOK_URL!; // eslint-disable-line
        notifiers.push(
          new SlackNotifier(webHookURL).withMessage(
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
