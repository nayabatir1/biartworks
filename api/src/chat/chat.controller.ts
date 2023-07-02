import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilService } from '../util/util.service';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get('defect/:id')
  async getAll(@Param('id') id: string) {
    const data = await this.service.getAll(id);

    return UtilService.buildResponse(data);
  }
}
