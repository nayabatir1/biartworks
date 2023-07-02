import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const companySchema = joi.object({
  name: joi.string().trim(),
  address: joi.string().trim(),
  phone: joi.string().trim(),
  employeeCount: joi.string().trim(),
  location: joi.string().trim(),
  zip: joi.string().trim(),
  language: joi.string().trim(),
});

export class CompanyDTO {
  @ApiProperty({ example: '', required: false })
  name?: string;

  @ApiProperty({ example: '', required: false })
  address?: string;

  @ApiProperty({ example: '', required: false })
  phone?: string;

  @ApiProperty({ example: '', required: false })
  employeeCount?: string;

  @ApiProperty({ example: '', required: false })
  location?: string;

  @ApiProperty({ example: '', required: false })
  zip?: string;

  @ApiProperty({ example: '', required: false })
  language?: string;
}
