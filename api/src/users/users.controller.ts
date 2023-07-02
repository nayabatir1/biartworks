import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Roles } from '../roles/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JoiQueryValidationPipe } from '../joi-validation/joi-query-validation/joi-query-validation.pipe';
import { UtilService } from '../util/util.service';
import {
  UpdateUserDTO,
  UserQueryDTO,
  updateUserSchema,
  userQuerySchema,
} from './users.dto';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UsePipes(new JoiQueryValidationPipe(userQuerySchema))
  async getAll(@Query() query: UserQueryDTO) {
    const data = await this.service.getAll(query);

    return UtilService.buildResponse(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get user by group id',
  })
  @ApiParam({ name: 'id', description: 'user group id' })
  @Roles(Role.ADMIN)
  @UsePipes(new JoiQueryValidationPipe(userQuerySchema))
  async getByUserGroup(@Param('id') id: string, @Query() query: UserQueryDTO) {
    const data = await this.service.getAll(query, id);

    return UtilService.buildResponse(data);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiBodyValidationPipe(updateUserSchema))
  async updateUser(@Body() body: UpdateUserDTO, @Param('id') userId: string) {
    await this.service.update(body, userId);

    return UtilService.buildResponse();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);

    return UtilService.buildResponse();
  }
}
