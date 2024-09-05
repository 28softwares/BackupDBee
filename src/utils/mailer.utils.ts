import { createTransport } from "nodemailer";
import EnvConfig from "../constants/env.config";
import Print from "../constants/Print";

const transporter = createTransport({
  host: "smtp.gmail.com",
  secure: true,
  requireTLS: true,
  auth: {
    user: EnvConfig.MAIL_USER,
    pass: EnvConfig.MAIL_PASSWORD,
  },
});

const validate = () => {
  if (!EnvConfig.MAIL_USER || !EnvConfig.MAIL_PASSWORD) {
    throw new Error("MAIL_USER or MAIL_PASSWORD is not set");
  }
  transporter.verify(function (error) {
    if (error) {
      console.log(error);
      Print.error("Mail setup failed");
    } else {
      console.log("Sending backups...");
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMail = async (file: any) => {
  console.log("validating mail");
  validate();
  const recipients = EnvConfig.CC_MAIL?.split(",");
  return await transporter.sendMail({
    from: EnvConfig.MAIL_USER,
    to: [EnvConfig.MAIL_USER, recipients && recipients.join(",")],
    html: "<h1>Date : " + new Date() + "</h1>",
    subject: `Backups`,
    attachments: [{ path: file }],
  });
};
