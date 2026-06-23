import dotenv from 'dotenv';
dotenv.config();

export const mailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'ambarJob007@gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },
  targetEmail: process.env.CONTACT_TARGET_EMAIL || 'ambarJob007@gmail.com'
};
