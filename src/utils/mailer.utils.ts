import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.argv[2],
    pass: process.argv[3],
  },
});

export const sendMail = async (filePath: string) => {
  return await transporter.sendMail({
    from: 'cliffbyte@gmail.com',
    to: process.argv[4],
    html: '<h1>Hello world</h1>',
    subject: 'Backup files',
    attachments: [{ path: filePath }],
  });
};
