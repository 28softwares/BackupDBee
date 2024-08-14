/* eslint-disable no-undef */
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});

export const sendMail = async (file: string) => {
  return await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    html: "<h1>Date : " + new Date() + "</h1>",
    subject: `Backups`,
    attachments: [{ path: file }],
  });
};
