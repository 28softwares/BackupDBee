import { createTransport } from "nodemailer";
import "dotenv/config";

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (filePath: string) => {
  return await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    html: "<h1>Hello world</h1>",
    subject: "Backup files",
    attachments: [{ path: filePath }],
  });
};
