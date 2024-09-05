import { Notifier } from "./Notifier";

export class SlackNotifier extends Notifier {
  constructor(webhookUrl: string, message: string) {
    super(webhookUrl, message);
  }
  sendNotification(): void {
    this.notify();
  }

}
