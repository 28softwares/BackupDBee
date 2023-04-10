import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'nabinsaud2059@gmail.com',
    pass: 'lwtewkjxhxqhyhji',
  },
});

export const sendMail = async (filePath: string) => {
  return await transporter.sendMail({
    from: 'cliffbyte@gmail.com',
    to: 'sovitthapa008@gmail.com',
    html: '<h1>Hello world</h1>',
    subject: 'Backup files',
    attachments: [{ path: filePath }],
  });
};
