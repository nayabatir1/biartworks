import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyDTO } from './company.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  select: Prisma.CompanySelect = {
    address: true,
    employeeCount: true,
    language: true,
    location: true,
    name: true,
    phone: true,
    zip: true,
  };

  async get() {
    return this.prisma.company.findFirst({ select: this.select });
  }

  async patch(body: CompanyDTO) {
    const found = await this.prisma.company.findFirst();

    if (!found) return this.prisma.company.create({ data: body });

    return this.prisma.company.update({
      where: { id: found.id },
      data: body,
      select: this.select,
    });
  }
}
