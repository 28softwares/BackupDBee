import { Notifier } from "./Notifier";

export class CustomNotifier extends Notifier {
  constructor(webhookUrl: string, message: string) {
    super(webhookUrl, message);
  }
  sendNotification(): void {
    this.notify();
  }

}
