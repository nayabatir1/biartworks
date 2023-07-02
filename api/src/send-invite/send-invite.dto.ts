import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const sendInviteSchema = joi.object({
  email: joi.string().trim().email().required(),
  groupIds: joi.array().items(joi.string().hex().length(24)),
});

export class sendInviteDTO {
  @ApiProperty({
    example: 'example@yopmail.com',
  })
  email: string;

  @ApiProperty({ example: [''], required: false })
  groupIds?: string[];
}
