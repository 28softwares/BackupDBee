import Log from "../constants/log";
import { Notifier } from "./notifier";

export class TelegramNotifier implements Notifier {
  private webhookUrl: string;
  private message: string;
  private chatId: number;

  constructor(webhookUrl: string, message: string, chatId: number) {
    this.webhookUrl = webhookUrl;
    this.message = message;
    this.chatId = chatId;
  }

  validate(): void {
    if (!this.webhookUrl) {
      throw new Error("[-] Webhook URL is not set");
    }

    if (!this.chatId) {
      throw new Error("[-] Chat Id is not set");
    }

    const newUrl = new URL(this.webhookUrl);
    if (newUrl.protocol !== "http:" && newUrl.protocol !== "https:") {
      throw new Error("[-] Webhook URL is invalid.");
    }
  }

  async notify(): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: this.message,
          chat_id: this.chatId,
        }),
      });

      if (!response.ok) {
        console.error(
          `[-] Failed to send notification to ${new URL(
            this.webhookUrl
          ).hostname.replace(".com", "")}: ${response.status} ${
            response.statusText
          } `
        );
      } else {
        console.log(
          `[+] Notification sent successfully to ${new URL(
            this.webhookUrl
          ).hostname.replace(".com", "")}`
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Error sending notification: ${error.message}`);
        console.error(`[-] Error sending notification: ${error.message}`);
      } else {
        Log.error(`Unknown error occurred.`);
        console.error(`[-] Unknown error occurred.`);
      }
    }
  }
}