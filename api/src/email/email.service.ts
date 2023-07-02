import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly service: MailerService) {}

  async sendMail(obj: ISendMailOptions) {
    return this.service
      .sendMail(obj)
      .then(() => console.log('Email sent --->', obj.to))
      .catch((err) => console.log(err));
  }
}
