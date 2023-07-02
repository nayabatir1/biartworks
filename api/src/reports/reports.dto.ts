import * as joi from 'joi';
import { paginationDTO, paginationSchema } from '../shared/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export const reportQuerySchema = paginationSchema.append({
  search: joi.string(),
  startDate: joi.date(),
  endDate: joi.when('startDate', {
    is: joi.exist(),
    then: joi.date().min(joi.ref('startDate')),
    otherwise: joi.forbidden(),
  }),
});

export class ReportQueryDTO extends paginationDTO {
  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;
}
