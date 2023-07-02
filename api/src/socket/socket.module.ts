import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { DefectLogModule } from '../defect-log/defect-log.module';
import { DefectsModule } from '../defects/defects.module';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [SocketGateway],
  imports: [DefectLogModule, DefectsModule, ChatModule, NotificationModule],
})
export class SocketModule {}
