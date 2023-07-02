import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { UserGroupsService } from './user-groups.service';
import { UtilService } from '../util/util.service';
import { CreateUserGroupsDTO, createUserGroupsSchema } from './user-groups.dto';
import { JoiQueryValidationPipe } from '../joi-validation/joi-query-validation/joi-query-validation.pipe';
import { paginationDTO, paginationSchema } from '../shared/pagination.dto';

@Controller('user-groups')
@ApiTags('User groups')
@ApiBearerAuth()
export class UserGroupsController {
  constructor(private readonly service: UserGroupsService) {}

  @Post()
  @UsePipes(new JoiBodyValidationPipe(createUserGroupsSchema))
  async signIn(@Body() body: CreateUserGroupsDTO) {
    const data = await this.service.create(body);

    return UtilService.buildResponse(data);
  }

  @Get()
  @UsePipes(new JoiQueryValidationPipe(paginationSchema))
  async getAll(@Query() query: paginationDTO) {
    const data = await this.service.getAll(query);

    return UtilService.buildResponse(data);
  }

  @Put(':id')
  @UsePipes(new JoiBodyValidationPipe(createUserGroupsSchema))
  async put(@Param('id') id: string, @Body() body: CreateUserGroupsDTO) {
    const data = await this.service.update(body, id);

    return UtilService.buildResponse(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(id);

    return UtilService.buildResponse(data);
  }
}
