import { Notifier } from "./Notifier";

export class DiscordNotifier extends Notifier {
  constructor(webhookUrl: string, message: string) {
    super(webhookUrl, message);
  }
  sendNotification(): void {
    this.notify();
  }

}
