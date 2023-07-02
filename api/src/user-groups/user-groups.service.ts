import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserGroupsDTO } from './user-groups.dto';
import { paginationDTO } from '../shared/pagination.dto';
import { Prisma } from '@prisma/client';
import { UtilService } from '../util/util.service';

@Injectable()
export class UserGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  select: Prisma.UserGroupsSelect = {
    type: true,
    id: true,
  };

  async create(body: CreateUserGroupsDTO) {
    const found = await this.prisma.userGroups.findFirst({
      where: { type: body.type },
    });

    if (found) throw new BadRequestException('User group already exists');

    return this.prisma.userGroups.create({ data: body, select: this.select });
  }

  async get(id: string) {
    return this.prisma.userGroups.findUnique({
      where: { id },
    });
  }

  async updateUserIds(groupIds: string[], userId: string) {
    // remove from all other group
    const groups = await this.prisma.userGroups.findMany({
      where: { id: { notIn: groupIds }, userIds: { has: userId } },
    });

    await Promise.all(
      groups.map((g) => {
        const userIds = g.userIds.filter((id) => id !== userId);

        return this.prisma.userGroups.update({
          where: { id: g.id },
          data: { userIds },
        });
      }),
    );

    // add to mentioned group
    await Promise.all(
      groupIds.map(async (gId) => {
        const group = await this.get(gId);

        return this.prisma.userGroups.update({
          where: { id: gId },
          data: { userIds: [...new Set([...group.userIds, userId])] },
        });
      }),
    );
  }

  async userGroupCount(ids: string[]) {
    return this.prisma.userGroups.count({
      where: { id: { in: ids } },
    });
  }

  async update(body: CreateUserGroupsDTO, id: string) {
    return this.prisma.userGroups.update({
      where: { id },
      data: body,
      select: this.select,
    });
  }

  async getAll(query: paginationDTO) {
    const filter: Prisma.UserGroupsFindManyArgs = {
      where: {},
      select: this.select,
    };

    const [count, docs] = await Promise.all([
      this.prisma.userGroups.count({ where: filter.where }),
      this.prisma.userGroups.findMany({
        ...filter,
        ...UtilService.paginationProps(query),
      }),
    ]);
    const pagination = UtilService.paginate(count, query);
    return { pagination, docs };
  }

  async remove(id: string) {
    return this.prisma.userGroups.delete({
      where: { id },
      select: this.select,
    });
  }
}
