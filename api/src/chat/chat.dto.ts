import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import * as joi from 'joi';

export const ChatSchema = joi.object({
  defectId: joi.string().hex().length(24).required(),
  fileId: joi.string().hex().length(24),
  text: joi.when('fileId', {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.string().required(),
  }),
  statusUpdated: joi.bool().default(false),
  status: joi.when('statusUpdated', {
    is: false,
    then: joi.forbidden(),
    otherwise: joi.string().valid(...Object.values(Status)),
  }),
});

export class ChatDTO {
  @ApiProperty({ example: '' })
  defectId: string;

  @ApiProperty({ example: '' })
  fileId?: string;

  @ApiProperty({ example: 'check' })
  text?: string;

  @ApiProperty({ default: false })
  statusUpdated: boolean;

  @ApiProperty({ enum: Status })
  status: Status;
}
