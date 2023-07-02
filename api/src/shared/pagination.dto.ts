import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

enum sortOrder {
  asc = 'asc',
  desc = 'desc',
}

export const paginationSchema = joi.object({
  limit: joi.number().integer().positive().default(10),
  page: joi.number().integer().positive().default(1),
  sortOrder: joi.string().valid('asc', 'desc').default('desc'),
  sortBy: joi.string().default('createdAt'),
});

export class paginationDTO {
  @ApiProperty({
    default: 10,
    required: false,
  })
  limit: number;

  @ApiProperty({
    default: 1,
    required: false,
  })
  page: number;

  @ApiProperty({
    enum: sortOrder,
    required: false,
    default: sortOrder.desc,
  })
  sortOrder: sortOrder;

  @ApiProperty({ default: 'createdAt', required: false })
  sortBy: string;
}
