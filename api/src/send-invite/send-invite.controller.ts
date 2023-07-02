import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendInviteService } from './send-invite.service';
import { sendInviteDTO, sendInviteSchema } from './send-invite.dto';
import { UtilService } from '../util/util.service';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { Role } from '@prisma/client';
import { Roles } from '../roles/roles.decorator';

@Controller('send-invite')
@ApiTags('Admin - send invite')
@ApiBearerAuth()
export class SendInviteController {
  constructor(private readonly service: SendInviteService) {}

  @ApiOperation({
    summary: 'send invite',
  })
  @Roles(Role.ADMIN)
  @Post()
  @UsePipes(new JoiBodyValidationPipe(sendInviteSchema))
  async sendInvite(@Body() body: sendInviteDTO) {
    this.service.sendInvite(body);

    return UtilService.buildResponse('Invite sent');
  }
}
