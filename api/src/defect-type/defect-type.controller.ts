import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefectTypeService } from './defect-type.service';
import { DefectTypeDTO } from './defect-type.dto';
import { GetUser } from '../users/users.decorator';
import { User } from '@prisma/client';
import { UtilService } from '../util/util.service';
import { paginationDTO } from '../shared/pagination.dto';
import { JWTPayload } from '../shared/types';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { defectTypeSchema } from './defect-type.dto';

@Controller('defect-type')
@ApiTags('Defect type')
@ApiBearerAuth()
export class DefectTypeController {
  constructor(private readonly service: DefectTypeService) {}

  @ApiOperation({ summary: 'get all defect type' })
  @Get()
  async getAll(@Query() query: paginationDTO) {
    const data = await this.service.getAll(query);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'add new defect type' })
  @UsePipes(new JoiBodyValidationPipe(defectTypeSchema))
  @Post()
  async create(@Body() body: DefectTypeDTO, @GetUser() user: JWTPayload) {
    const data = await this.service.create(body, user);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'update defect type' })
  @UsePipes(new JoiBodyValidationPipe(defectTypeSchema))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: DefectTypeDTO,
    @GetUser() user: User,
  ) {
    const data = await this.service.update(body, user, id);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'delete defect type' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(id);

    return UtilService.buildResponse(data);
  }
}
