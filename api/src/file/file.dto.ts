import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const fileUploadSchema = joi.object({
  file: joi.any().required(),
});

export class FilesUploadDto {
  @ApiProperty({
    description: 'all file allowed',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: any;
}
