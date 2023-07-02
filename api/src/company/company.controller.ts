import { Body, Controller, Get, Patch, UsePipes } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UtilService } from '../util/util.service';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { CompanyDTO, companySchema } from './company.dto';

@Controller('company')
@ApiTags('Company')
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @ApiOperation({ summary: 'get company details' })
  @Get()
  async get() {
    const data = await this.service.get();

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'update company details' })
  @UsePipes(new JoiBodyValidationPipe(companySchema))
  @Patch()
  async patch(@Body() body: CompanyDTO) {
    const data = await this.service.patch(body);

    return UtilService.buildResponse(data);
  }
}
