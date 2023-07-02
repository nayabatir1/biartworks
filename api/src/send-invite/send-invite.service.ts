import { Injectable } from '@nestjs/common';
import { sendInviteDTO } from './send-invite.dto';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SendInviteService {
  constructor(
    private readonly mail: EmailService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async sendInvite(body: sendInviteDTO) {
    await this.userService.create(body);

    return this.mail.sendMail({
      to: body.email,
      subject: 'Link to Signup',
      template: 'sendInvite',
      context: {
        email: body.email,
      },
    });
  }
}
