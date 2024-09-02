import Print from "../constants/Print";
import { Notifier } from "./notifier.utils";

export class SlackNotifier extends Notifier {
  private message: string = "";

  constructor(private readonly webhookUrl: string) {
    super();
    this.webhookUrl = webhookUrl;
  }

  validate() {
    if (!this.webhookUrl) {
      Print.error("SLACK_WEBHOOK_URL is not set");
      throw new Error("SLACK_WEBHOOK_URL is not set");
    }
  }

  async notify(message: string) {
    console.log("Sending Slack Notification...", message, this.message);
    if (message) {
      console.log("Message...:", message);
      this.message = message;
    }
    this.validate();
    const slackMessage = {
      text: `AutoBackup🤖: ${this.message}`,
    };
    try {
      await fetch(this.webhookUrl, {
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

  withMessage(message: string) {
    this.message = message;
    return this;
  }
}
