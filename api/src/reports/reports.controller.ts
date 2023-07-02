import { Controller, Get, Query, Res, UsePipes } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JoiQueryValidationPipe } from '../joi-validation/joi-query-validation/joi-query-validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportQueryDTO, reportQuerySchema } from './reports.dto';
import { UtilService } from '../util/util.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('reports')
@ApiTags('Reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get()
  @UsePipes(new JoiQueryValidationPipe(reportQuerySchema))
  async getAll(@Query() query: ReportQueryDTO) {
    const data = await this.service.getAll(query);

    return UtilService.buildResponse(data);
  }

  @Get('/download')
  async downloadReport(@Res() res: Response) {
    const path = await this.service.downloadReport();

    const [filename] = path.split('/').slice(-1);

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    res.sendFile(filename, { root: join(__dirname, '../', '../', 'upload') });
  }
}
