import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import * as joi from 'joi';
import { paginationDTO, paginationSchema } from '../shared/pagination.dto';

export const createDefectsSchema = joi.object({
  partNo: joi.string().trim().required(),
  imageIds: joi.array().min(1).items(joi.string().hex().length(24).required()),
  defectTypeId: joi.string().hex().length(24).required(),
  userGroupIds: joi
    .array()
    .min(1)
    .items(joi.string().hex().length(24).required()),
  emails: joi.array().items(joi.string().trim().email()),
});

export class createDefectsDTO {
  @ApiProperty({ example: '9P4427-64563' })
  partNo: string;

  @ApiProperty({ example: [''] })
  imageIds: string[];

  @ApiProperty({ example: '' })
  defectTypeId: string;

  @ApiProperty({ example: [''] })
  userGroupIds: string[];

  @ApiProperty({ example: [''] })
  emails: string[];
}

export const getDefectsSchema = paginationSchema.append({
  search: joi.string().trim(),
  startDate: joi.date(),
  endDate: joi.when('startDate', {
    is: joi.exist(),
    then: joi.date().greater(joi.ref('startDate')),
    otherwise: joi.forbidden(),
  }),
});

export class getDefectsDTO extends paginationDTO {
  @ApiProperty({ example: 'splits', required: false })
  search?: string;

  @ApiProperty({ example: '2023-06-03T12:14:44.499Z', required: false })
  startDate?: Date;

  @ApiProperty({ example: '2023-06-03T12:14:44.499Z', required: false })
  endDate?: Date;
}

export const UpdateDefectSchema = createDefectsSchema.fork(
  ['partNo', 'userGroupIds', 'defectTypeId', 'emails'],
  (schema) => schema.forbidden(),
);

export class UpdateDefectDTO extends PartialType(
  OmitType(createDefectsDTO, [
    'partNo',
    'userGroupIds',
    'defectTypeId',
    'emails',
  ]),
) {}
