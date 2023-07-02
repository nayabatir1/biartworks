import { Module } from '@nestjs/common';
import { DefectsController } from './defects.controller';
import { DefectsService } from './defects.service';
import { DefectLogModule } from '../defect-log/defect-log.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [DefectsController],
  providers: [DefectsService],
  imports: [NotificationModule, DefectLogModule, UsersModule],
  exports: [DefectsService],
})
export class DefectsModule {}
