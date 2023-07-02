import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DefectLogService {
  constructor(private readonly prisma: PrismaService) {}

  async updateLog({
    defectId,
    actionTaken,
    userId,
    status,
  }: {
    defectId: string;
    actionTaken?: string;
    userId: string;
    status?: Status;
  }) {
    return this.prisma.defectsLog.upsert({
      where: { defectId },
      update: {
        actionTaken,
        updatedById: userId,
        status,
        updatedAt: new Date(),
      },
      create: {
        actionTaken,
        updatedById: userId,
        defectId,
        updatedAt: new Date(),
      },
    });
  }

  async getDefectStatusCount() {
    return this.prisma.defectsLog.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
          },
        },
      ],
    });
  }
}
