import { Body, Controller, Put, UsePipes } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { TokenDTO, tokenSchema } from './notification.dto';
import { GetUser } from '../users/users.decorator';
import { JWTPayload } from '../shared/types';
import { UtilService } from '../util/util.service';

@Controller('notification')
@ApiTags('Notificaton')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @ApiOperation({ summary: 'set token for push notification' })
  @UsePipes(new JoiBodyValidationPipe(tokenSchema))
  @Put()
  async setToken(@Body() body: TokenDTO, @GetUser() user: JWTPayload) {
    await this.service.setToken(body, user);

    return UtilService.buildResponse();
  }
}
