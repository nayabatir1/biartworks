import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDTO } from './reports.dto';
import { UtilService } from '../util/util.service';
import { Prisma } from '@prisma/client';
import { parse } from 'json2csv';
import * as dayjs from 'dayjs';
import { writeFile } from 'fs/promises';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  select: Prisma.DefectsLogSelect = {
    id: true,
    defect: {
      select: { partNo: true, defectType: { select: { type: true } } },
    },
    createdAt: true,
    status: true,
    actionTaken: true,
    updatedBy: { select: { name: true, id: true } },
    updatedAt: true,
  };

  async getAll(query: ReportQueryDTO) {
    const filter: Prisma.DefectsLogFindManyArgs = {
      where: {},
      select: this.select,
    };

    if (query.search && query.endDate && query.endDate)
      filter.where = {
        AND: [
          {
            OR: [
              {
                defect: {
                  OR: [
                    { partNo: { contains: query.search, mode: 'insensitive' } },
                    {
                      defectType: {
                        type: { contains: query.search, mode: 'insensitive' },
                      },
                    },
                  ],
                },
              },
              {
                updatedBy: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          },
          {
            OR: [
              {
                createdAt: {
                  lte: query.endDate,
                  gte: query.startDate,
                },
              },
              {
                updatedAt: {
                  lte: query.endDate,
                  gte: query.startDate,
                },
              },
            ],
          },
        ],
      };
    else if (query.search)
      filter.where = {
        OR: [
          {
            defect: {
              OR: [
                { partNo: { contains: query.search, mode: 'insensitive' } },
                {
                  defectType: {
                    type: { contains: query.search, mode: 'insensitive' },
                  },
                },
              ],
            },
          },
          {
            updatedBy: {
              name: { contains: query.search, mode: 'insensitive' },
            },
          },
        ],
      };
    else if (query.startDate && query.endDate)
      filter.where = {
        OR: [
          {
            createdAt: {
              lte: query.endDate,
              gte: query.startDate,
            },
          },
          {
            updatedAt: {
              lte: query.endDate,
              gte: query.startDate,
            },
          },
        ],
      };

    const [count, docs] = await Promise.all([
      this.prisma.defectsLog.count({ where: filter.where }),
      this.prisma.defectsLog.findMany({
        ...filter,
        ...UtilService.paginationProps(query),
      }),
    ]);
    const pagination = UtilService.paginate(count, query);
    return { pagination, docs };
  }

  async downloadReport() {
    const reports = await this.prisma.defectsLog.findMany({
      where: {},
      select: {
        defect: {
          select: { partNo: true, defectType: { select: { type: true } } },
        },
        createdAt: true,
        status: true,
        actionTaken: true,
        updatedBy: { select: { name: true, id: true } },
        updatedAt: true,
      },
    });

    const path = './upload/report.csv';

    const fields = [
      'PART #',
      'DEFECT',
      'CREATED AT',
      'STATUS',
      'ACTION',
      'UPDATED AT',
      'CHANGED BY',
    ];

    const data = reports.map((r) => ({
      'PART #': r.defect.partNo,
      DEFECT: r.defect.defectType.type,
      'CREATED AT': dayjs(r.createdAt).format('DD MMM, YY h:m A'),
      STATUS: r.status,
      ACTION: r.actionTaken,
      'UPDATED AT': dayjs(r.updatedAt).format('DD MMM, YY h:m A'),
      'CHANGED BY': r.updatedBy.name,
    }));

    const opts = { fields };
    const csvData = parse(data, opts);

    await writeFile(path, csvData);

    return path;
  }
}
