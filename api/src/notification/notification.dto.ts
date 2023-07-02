import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const tokenSchema = joi.object({
  token: joi.string().required(),
});

export class TokenDTO {
  @ApiProperty({ description: 'user firebase fmc token' })
  token: string;
}
