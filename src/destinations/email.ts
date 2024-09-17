import { createTransport } from "nodemailer";
import Log from "../constants/log";
import { Sender, SenderOption } from "./sender";
import Mail from "nodemailer/lib/mailer";
import { config } from "../utils/cli.utils";

export class EmailSender implements Sender {
  private static transporterInstance: Mail | null = null;
  private static getTransporter(): Mail {
    if (!EmailSender.transporterInstance) {
      EmailSender.transporterInstance = createTransport({
        host: config.destinations.email.smtp_server,
        secure: true,
        requireTLS: true,
        auth: {
          user: config.destinations.email.smtp_username,
          pass: config.destinations.email.smtp_password,
        },
      });
    }
    return EmailSender.transporterInstance;
  }

  private mailOptions: Mail.Options;
  constructor(readonly from: string, readonly to: string[], filePath: string) {
    this.mailOptions = {
      from: from,
      to: to.join(","),
      subject: "Backup",
      html: "<h1>Date : " + new Date() + "</h1>",
      attachments: [{ path: filePath }],
    };
  }

  validate(): void {
    if (!this.mailOptions.from) {
      throw new Error("[-] Email address is not set");
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(this.mailOptions.from as string)) {
      throw new Error("[-] Email address is invalid.");
    }

    if (
      !config.destinations.email.smtp_username ||
      !config.destinations.email.smtp_password
    ) {
      throw new Error("[-] MAIL_USER or MAIL_PASSWORD is not set");
    }
    const transporter = EmailSender.getTransporter();
    transporter.verify(function (error) {
      if (error) {
        console.log(error);
        Log.error("[-] Mail setup failed");
      } else {
        console.log("[+] Sending backups...");
      }
    });
  }

  async send(option?: SenderOption): Promise<void> {
    try {
      if (option?.fileName) {
        this.mailOptions.attachments = [{ path: option.fileName }];
      }
      const transporter = EmailSender.getTransporter();
      await transporter.sendMail(this.mailOptions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Error sending email: ${error.message}`);
        console.error(`[-] Error sending email: ${error.message}`);
      } else {
        Log.error(`Unknown error occurred.`);
        console.error(`[-] Unknown error occurred.`);
      }
    }
  }
}
