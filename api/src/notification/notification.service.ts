import { Injectable } from '@nestjs/common';
import { DefectType } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenDTO } from './notification.dto';
import { JWTPayload } from '../shared/types';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

const jsonPath = process.cwd() + '/firebase.json';

admin.initializeApp({
  credential: admin.credential.cert(jsonPath),
});

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async newDefectNotification(
    userGroupIds: string[],
    emails: string[],
    defectType: DefectType,
    partNo: string,
    userId: string,
    defectId: string,
  ) {
    const groups = await this.prisma.userGroups.findMany({
      where: { id: { in: userGroupIds } },
      select: { users: { select: { email: true, name: true, token: true } } },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const token = [user.token];

    groups.forEach((g) =>
      g.users.forEach((u) => {
        emails.push(u.email);

        token.push(u.token);
      }),
    );

    await Promise.all([
      ...token.map((t) => {
        if (!t) return Promise.resolve();

        const message: Message = {
          notification: {
            body: 'Type of defect: ' + defectType.type,
            title: 'New defect added',
          },
          token: t,
          data: {
            defectId,
          },
          android: {
            priority: 'high',
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
          },
        };

        return admin
          .messaging()
          .send(message)
          .then((msg) => console.log(msg));
      }),
      ...emails.map((e) =>
        this.emailService.sendMail({
          to: e,
          subject: 'New defect added',
          template: 'defect',
          from: process.env.SMTP_FROM,
          context: {
            defectType: defectType.type,
            name: user.name,
            partNo,
          },
        }),
      ),
    ]);
  }

  async setToken({ token }: TokenDTO, user: JWTPayload) {
    return this.prisma.user.update({
      where: { id: user.sub },
      data: { token },
    });
  }

  async statusUpdateNotification(
    defectId: string,
    status: string,
    text: string,
    name: string,
  ) {
    const access = await this.prisma.defectAccess.findFirst({
      where: { defectsId: defectId },
      include: {
        userGroups: {
          include: {
            users: true,
          },
        },
        users: true,
        defect: {
          include: { defectType: true },
        },
      },
    });

    const users: Array<{ email: string; token: string }> = [];

    access.userGroups.forEach((g) => {
      g.users.map((u) => {
        users.push({ email: u.email, token: u.token });
      });
    });

    access.users.forEach((u) => {
      users.push({ email: u.email, token: u.token });
    });

    await Promise.all([
      ...users.map((t) => {
        if (!t.token) return Promise.resolve();

        const message: Message = {
          notification: {
            body: text,
            title:
              access.defect.defectType.type + ' status changed to ' + status,
          },
          token: t.token,
          data: {
            defectId,
          },
          android: {
            priority: 'high',
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
          },
        };

        return admin
          .messaging()
          .send(message)
          .then((msg) => console.log(msg));
      }),
      ...users.map((e) =>
        this.emailService.sendMail({
          to: e.email,
          subject: 'Defect status update',
          template: 'statusUpdate',
          from: process.env.SMTP_FROM,
          context: {
            name,
            status,
            text,
          },
        }),
      ),
    ]);
  }
}
