import Print from "../constants/Print";
import { Notifier } from "./Notifier";

export class DiscordNotifier extends Notifier {
  private message: string = "";

  constructor(private readonly webhookUrl: string) {
    super();
    this.webhookUrl = webhookUrl;
  }

  validate() {
    if (!this.webhookUrl) {
      Print.error("DISCORD_WEBHOOK_URL is not set");
      throw new Error("DISCORD_WEBHOOK_URL is not set");
    }
  }

  async notify(message?: string) {
    if (message) {
      this.message = message;
    }
    this.validate();
    const discordMessage = {
      content: this.message,
      username: "Captain Hook",
    };
    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });
      console.log("Discord Notification Successfully Sent...");
    } catch (error) {
      console.error(error);
    }
  }

  withMessage(message: string) {
    this.message = message;
    return this;
  }
}
