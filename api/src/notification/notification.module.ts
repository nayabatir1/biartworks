import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from '../email/email.module';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [EmailModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
