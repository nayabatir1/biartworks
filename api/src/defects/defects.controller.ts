import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  UpdateDefectDTO,
  UpdateDefectSchema,
  createDefectsDTO,
  createDefectsSchema,
  getDefectsDTO,
  getDefectsSchema,
} from './defects.dto';
import { GetUser } from '../users/users.decorator';
import { DefectsService } from './defects.service';
import { UtilService } from '../util/util.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWTPayload } from '../shared/types';
import { JoiQueryValidationPipe } from '../joi-validation/joi-query-validation/joi-query-validation.pipe';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';

@Controller('defects')
@ApiTags('Defects')
@ApiBearerAuth()
export class DefectsController {
  constructor(private readonly service: DefectsService) {}

  @ApiOperation({ summary: 'create defect' })
  @UsePipes(new JoiBodyValidationPipe(createDefectsSchema))
  @Post()
  async create(@Body() body: createDefectsDTO, @GetUser() user: JWTPayload) {
    const data = await this.service.create(body, user);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'Get defects paginated' })
  @UsePipes(new JoiQueryValidationPipe(getDefectsSchema))
  @Get()
  async getAll(@Query() query: getDefectsDTO, @GetUser() user: JWTPayload) {
    const data = await this.service.getAll(query, user);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'Get defect by id' })
  @ApiParam({ name: 'id', description: 'defect id' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await this.service.get(id);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'update defect by id' })
  @ApiParam({ name: 'id', description: 'defect id' })
  @UsePipes(new JoiBodyValidationPipe(UpdateDefectSchema))
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDefectDTO) {
    const data = await this.service.update(id, body);

    return UtilService.buildResponse(data);
  }
}
