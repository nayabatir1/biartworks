import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DefectTypeDTO } from './defect-type.dto';
import { Prisma, User } from '@prisma/client';
import { paginationDTO } from '../shared/pagination.dto';
import { UtilService } from '../util/util.service';
import { JWTPayload } from '../shared/types';

@Injectable()
export class DefectTypeService {
  constructor(private readonly prisma: PrismaService) {}

  select: Prisma.DefectTypeSelect = {
    type: true,
    id: true,
  };

  async create(body: DefectTypeDTO, user: JWTPayload) {
    return this.prisma.defectType.create({
      data: { ...body, createdById: user.sub },
      select: this.select,
    });
  }

  async update(body: DefectTypeDTO, user: User, id: string) {
    return this.prisma.defectType.update({
      where: { id },
      data: { ...body, createdById: user.id },
      select: this.select,
    });
  }

  async getAll(query: paginationDTO) {
    const filter: Prisma.DefectTypeFindManyArgs = {
      where: {},
      select: this.select,
    };

    const [count, docs] = await Promise.all([
      this.prisma.defectType.count({ where: filter.where }),
      this.prisma.defectType.findMany({
        ...filter,
        ...UtilService.paginationProps(query),
      }),
    ]);
    const pagination = UtilService.paginate(count, query);
    return { pagination, docs };
  }

  async remove(id: string) {
    return this.prisma.defectType.delete({
      where: { id },
      select: this.select,
    });
  }
}
