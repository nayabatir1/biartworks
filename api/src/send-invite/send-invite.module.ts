import { Module } from '@nestjs/common';
import { SendInviteController } from './send-invite.controller';
import { SendInviteService } from './send-invite.service';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [SendInviteController],
  providers: [SendInviteService],
  imports: [EmailModule, UsersModule],
})
export class SendInviteModule {}
