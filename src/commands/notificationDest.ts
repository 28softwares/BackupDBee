import { select, text } from "@clack/prompts";
import { saveConfigToEnv } from "./envWriter";
import { promptWithCancel } from "./promptWithCancel";

type Config = {
  notificationDestination: string | symbol;
  discordWebhookUrl?: string | symbol;
  slackWebhookUrl?: string | symbol;
};

const notificationDest = async () => {
  const config: Config = {
    notificationDestination: await promptWithCancel(select, {
      message: "Select a notification destination",
      options: [
        { label: "Slack", value: "SLACK" },
        { label: "Discord", value: "DISCORD" },
        { label: "Both", value: "SLACK,DISCORD" },
      ],
      initialValue: "SLACK",
    }),
  };

  switch (config.notificationDestination) {
    case "SLACK":
      config.slackWebhookUrl = await promptWithCancel(text, {
        message: "Enter slack webhook url",
      });
      break;
    case "DISCORD":
      config.discordWebhookUrl = await promptWithCancel(text, {
        message: "Enter discord webhook url",
      });
      break;
    case "SLACK,DISCORD":
      config.slackWebhookUrl = await promptWithCancel(text, {
        message: "Enter slack webhook url",
      });
      config.discordWebhookUrl = await promptWithCancel(text, {
        message: "Enter discord webhook url",
      });
      break;
    default:
      break;
  }

  saveConfigToEnv({
    BACKUP_NOTIFICATION: config.notificationDestination,
    SLACK_WEBHOOK_URL: String(config.slackWebhookUrl),
    DISCORD_WEBHOOK_URL: String(config.discordWebhookUrl),
  });
};

export default notificationDest;
