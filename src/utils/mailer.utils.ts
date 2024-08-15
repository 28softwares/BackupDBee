/* eslint-disable no-undef */
import { createTransport } from "nodemailer";
import "dotenv/config";
import Print from "../constants/Print";


const transporter = createTransport({
  host: "smtp.gmail.com",
  secure: true,
  requireTLS: true,
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});


transporter.verify(function (error) {
  if (error) {
    console.log(error);
    Print.error("Mail setup failed")
  } else {
    console.log("Sending backups...");
  }
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMail = async (file: any) => {
  return await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    html: "<h1>Date : " + new Date() + "</h1>",
    subject: `Backups`,
    attachments: [{ path: file }],
  }
);
};
