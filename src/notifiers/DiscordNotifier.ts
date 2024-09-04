import Log from "../constants/Log";
import { Notifier } from "./Notifier";

export class DiscordNotifier extends Notifier {
  private message: string = "";

  constructor(private readonly webhookUrl: string) {
    super();
    this.webhookUrl = webhookUrl;
  }

  validate() {
    if (!this.webhookUrl) {
      Log.error("Discord_URL is not set");
      throw new Error("[-] Discord_URL is not set");
    }

    const newUrl = new URL(this.webhookUrl);
    if (newUrl.protocol !== "http:" && newUrl.protocol !== "https:") {
      throw new Error("[-] Discord webhook url is invalid. ");
    }
  }

  async notify(message?: string) {
    if (message) {
      this.message = message;
    }
    this.validate();
    const webhookMessage = {
      content: this.message,
    };
    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookMessage),
      });
      console.log("[+] Notification successfully sent to discord.");
    } catch (error) {
      console.error(error);
    }
  }

  withMessage(message: string) {
    this.message = message;
    return this;
  }
}
