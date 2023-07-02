import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export const createUserGroupsSchema = joi.object({
  type: joi.string().trim().required(),
});

export class CreateUserGroupsDTO {
  @ApiProperty({
    example: 'electrician',
  })
  type: string;
}
