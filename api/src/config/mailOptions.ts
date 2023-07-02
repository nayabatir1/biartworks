import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export const mailOption: MailerOptions = {
  transport: {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
  template: {
    dir: './templates',
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};
