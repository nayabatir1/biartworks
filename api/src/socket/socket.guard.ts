import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token = this.extractTokenFromHeader(client.handshake);

    if (!token) return false;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      client['user'] = payload;
    } catch (error) {
      return false;
    }

    return true;
  }

  private extractTokenFromHeader({
    headers,
  }: Socket['handshake'] & { headers: { authorization?: string } }) {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
