import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { envOptions } from './config/envOptions';
import { SendInviteModule } from './send-invite/send-invite.module';
import { EmailModule } from './email/email.module';
import { mailOption } from './config/mailOptions';
import { UtilModule } from './util/util.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserGroupsModule } from './user-groups/user-groups.module';
import { FileModule } from './file/file.module';
import { DefectsModule } from './defects/defects.module';
import { DefectTypeModule } from './defect-type/defect-type.module';
import { SocketModule } from './socket/socket.module';
import { DefectLogModule } from './defect-log/defect-log.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { CompanyModule } from './company/company.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot(envOptions),
    MailerModule.forRoot(mailOption),
    PrismaModule,
    SendInviteModule,
    EmailModule,
    UtilModule,
    AuthModule,
    UsersModule,
    UserGroupsModule,
    FileModule,
    DefectsModule,
    DefectTypeModule,
    SocketModule,
    DefectLogModule,
    ChatModule,
    NotificationModule,
    CompanyModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
