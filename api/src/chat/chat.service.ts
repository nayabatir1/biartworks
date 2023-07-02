import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDTO } from '../chat/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  select: Prisma.ChatsSelect = {
    text: true,
    file: { select: { key: true, mimeType: true, id: true } },
    statusUpdated: true,
    status: true,
    sender: { select: { name: true, id: true } },
    id: true,
    createdAt: true,
    defectId: true,
  };

  async getAll(defectId: string) {
    return this.prisma.chats.findMany({
      where: { defectId },
      select: this.select,
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(payload: ChatDTO, userId: string) {
    return this.prisma.chats.create({
      data: { ...payload, senderId: userId },
      select: this.select,
    });
  }
}
