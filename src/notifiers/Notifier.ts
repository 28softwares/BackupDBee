import Log from "../constants/Log";

export abstract class Notifier {
    protected webhookUrl: string;
    protected message: string;

    constructor(webhookUrl: string, message: string) {
        this.webhookUrl = webhookUrl;
        this.message = message;
      }

    abstract sendNotification(): void;

    validate(): void {
      if (!this.webhookUrl) {
        throw new Error("[-] Webhook URL is not set");
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: this.message
          })
        });
  
        if (!response.ok) {
          console.error(`[-] Failed to send notification to ${new URL(this.webhookUrl).hostname.replace('.com',"")}: ${response.status} ${response.statusText} `);
        } else {
          console.log(`[+] Notification sent successfully to ${new URL(this.webhookUrl).hostname.replace('.com',"")}`);
        }
      } catch (error) {
        Log.error(`Error sending notification: ${error}`) 
        console.error(`[-] Error sending notification: ${error}`);
      }
    }
  }

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}