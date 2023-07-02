import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefectLogService } from './defect-log.service';
import { UtilService } from '../util/util.service';

@Controller('defect-log')
@ApiTags('Defects-log')
@ApiBearerAuth()
export class DefectLogController {
  constructor(private readonly service: DefectLogService) {}

  @ApiOperation({ summary: 'get defect summary' })
  @Get()
  async getDefectStatusCount() {
    const data = await this.service.getDefectStatusCount();

    return UtilService.buildResponse(data);
  }
}
