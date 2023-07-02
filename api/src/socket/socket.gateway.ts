import { UseGuards, UsePipes } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGuard } from './socket.guard';
import { JwtService } from '@nestjs/jwt';
import { ChatDTO, ChatSchema } from '../chat/chat.dto';
import { JWTPayload } from '../shared/types';
import { DefectLogService } from '../defect-log/defect-log.service';
import { JoiSocketValidationPipe } from '../joi-validation/joi-socket-validation/joi-socket-validation.pipe';
import { DefectsService } from '../defects/defects.service';
import { ChatService } from '../chat/chat.service';
import { NotificationService } from '../notification/notification.service';

@UseGuards(SocketGuard)
@WebSocketGateway({
  path: '/api-socket',
  cors: true,
})
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    private readonly defectLogService: DefectLogService,
    private readonly defectService: DefectsService,
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer() wss: Server;

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.send('No authorization token');

      client.disconnect();
    }

    const token = this.extractTokenFromHeader(client.handshake);
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      client.send('Invalid token');
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  @UsePipes(new JoiSocketValidationPipe(ChatSchema))
  async handleMessage(client: Socket & { user: JWTPayload }, payload: ChatDTO) {
    const chat = await this.chatService.create(payload, client.user.sub);

    this.wss.emit('message', chat);

    if (!payload.statusUpdated) return;

    await this.defectService.updateStatus(
      payload.defectId,
      payload.text,
      client.user,
      payload.status,
    );

    await this.defectLogService.updateLog({
      defectId: payload.defectId,
      actionTaken: payload.text,
      userId: client.user.sub,
    });

    client.broadcast.emit('defect-update', payload.defectId);

    this.notificationService.statusUpdateNotification(
      payload.defectId,
      payload.status,
      payload.text,
      client.user.name,
    );
  }

  // notify other users to update defect details
  @SubscribeMessage('defect-update')
  async updateDefect(client: Socket & { user: JWTPayload }, payload: string) {
    client.broadcast.emit('defect-update', payload);
  }

  private extractTokenFromHeader({
    headers,
  }: Socket['handshake'] & { headers: { authorization?: string } }) {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
