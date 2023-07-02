import * as joi from 'joi';
import { paginationDTO, paginationSchema } from '../shared/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export const userQuerySchema = paginationSchema.append({
  search: joi.string().trim(),
});

export class UserQueryDTO extends paginationDTO {
  @ApiProperty({
    example: '',
    description: 'search user by name or email',
    required: false,
  })
  search?: string;
}

export const updateUserSchema = joi.object({
  groupIds: joi.array().items(joi.string().hex().length(24)),
});

export class UpdateUserDTO {
  @ApiProperty({ example: [''] })
  groupIds: string[];
}
