import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const defectTypeSchema = joi.object({
  type: joi.string().trim().required(),
});

export class DefectTypeDTO {
  @ApiProperty({ example: 'Splits' })
  type: string;
}
