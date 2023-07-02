import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UtilService } from '../util/util.service';
import {
  UpdateDefectDTO,
  createDefectsDTO,
  getDefectsDTO,
} from './defects.dto';
import { JWTPayload } from '../shared/types';
import { DefectLogService } from '../defect-log/defect-log.service';
import { NotificationService } from '../notification/notification.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DefectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly defectLogService: DefectLogService,
    private readonly userService: UsersService,
  ) {}

  select: Prisma.DefectsSelect = {
    id: true,
    partNo: true,
    status: true,
    images: { select: { key: true, id: true } },
    defectType: { select: { type: true, id: true } },
    createdAt: true,
  };

  selectWithChats: Prisma.DefectsSelect = {
    id: true,
    partNo: true,
    status: true,
    images: { select: { key: true, id: true } },
    defectType: { select: { type: true, id: true } },
  };

  async getAll(query: getDefectsDTO, user: JWTPayload) {
    let defectIds = [];

    let defectAccessWhere: Prisma.DefectAccessWhereInput = {};

    if (user.groupIds)
      defectAccessWhere = {
        OR: [
          { userGroupIds: { hasSome: user.groupIds } },
          { userIds: { has: user.sub } },
        ],
      };
    else defectAccessWhere = { userIds: { has: user.sub } };

    const defectAccess = await this.prisma.defectAccess.findMany({
      where: defectAccessWhere,
    });

    defectAccess.forEach((d) => defectIds.push(d.defectsId));

    if (query.search) {
      const defectType = await this.prisma.defectType.findMany({
        where: {
          AND: [
            { type: { contains: query.search, mode: 'insensitive' } },
            { defects: { every: { id: { in: defectIds } } } },
          ],
        },
        select: { defects: { select: { id: true } } },
      });

      const chats = await this.prisma.chats.findMany({
        where: {
          AND: [
            { text: { contains: query.search, mode: 'insensitive' } },
            { defectId: { in: defectIds } },
          ],
        },
        select: { defects: { select: { id: true } } },
      });

      defectIds = [];

      defectType
        .filter((df) => df.defects)
        .forEach((df) => {
          df.defects.forEach((d) => defectIds.push(d.id));
        });

      chats.forEach((ch) => {
        defectIds.push(ch.defects.id);
      });
    }

    const where: Prisma.DefectsWhereInput = {
      id: { in: defectIds },
    };

    if (query.startDate && query.endDate) {
      where.AND = [
        { id: where.id },
        {
          createdAt: {
            gte: query.startDate,
            lte: query.endDate,
          },
        },
      ];
    }

    const filter: Prisma.DefectsFindManyArgs = {
      where,
      select: this.select,
    };

    const [count, docs] = await Promise.all([
      this.prisma.defects.count({ where: filter.where }),
      this.prisma.defects.findMany({
        ...filter,
        ...UtilService.paginationProps(query),
      }),
    ]);
    const pagination = UtilService.paginate(count, query);
    return { pagination, docs };
  }

  async get(id: string) {
    return this.prisma.defects.findUnique({
      where: { id },
      select: this.selectWithChats,
    });
  }

  async create(body: createDefectsDTO, user: JWTPayload) {
    const { userGroupIds, emails = [] } = body;

    delete body.userGroupIds;
    delete body.emails;

    const users = await this.userService.getUserByEmails(emails);

    if (emails.length !== users.length)
      throw new BadRequestException('One of the email is invalid');

    const userIds = users.map((u) => u.id);

    const data = await this.prisma.defects.create({
      data: {
        ...body,
        createdById: user.sub,
        images: { connect: body.imageIds.map((id) => ({ id })) },
      },
      select: this.select,
    });

    await this.prisma.defectAccess.create({
      data: {
        defectsId: data.id,
        userGroupIds,
        userIds,
      },
    });

    await this.defectLogService.updateLog({
      defectId: data.id,
      userId: user.sub,
      actionTaken: 'New defect added',
      status: Status.OPEN,
    });

    this.notificationService.newDefectNotification(
      userGroupIds,
      [...emails, user.email],
      data.defectType,
      data.partNo,
      user.sub,
      data.id,
    );

    return data;
  }

  async updateStatus(
    id: string,
    actionTaken: string,
    user: JWTPayload,
    status: Status,
  ) {
    await this.prisma.defects.update({ where: { id }, data: { status } });
    await this.defectLogService.updateLog({
      defectId: id,
      actionTaken,
      userId: user.sub,
      status,
    });
  }

  async update(id: string, body: UpdateDefectDTO) {
    const oldData = await this.prisma.defects.findFirst({
      where: { id },
    });

    const filteredIds = oldData.imageIds
      .filter((id) => !body.imageIds.includes(id))
      .map((id) => ({ id }));

    return this.prisma.defects.update({
      where: { id },
      data: {
        ...body,
        images: {
          disconnect: filteredIds,
          connect: body.imageIds.map((id) => ({ id })),
        },
      },
      select: this.select,
    });
  }
}
