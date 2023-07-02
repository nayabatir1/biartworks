import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDTO, changePasswordDTO } from '../auth/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash, genSalt } from 'bcrypt';
import { sendInviteDTO } from '../send-invite/send-invite.dto';
import { EmailService } from '../email/email.service';
import { OTPStatus, Prisma, Role } from '@prisma/client';
import { UserGroupsService } from '../user-groups/user-groups.service';
import { UtilService } from '../util/util.service';
import { UpdateUserDTO, UserQueryDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly userGroupService: UserGroupsService,
  ) {}

  select: Prisma.UserSelect = {
    name: true,
    id: true,
    email: true,
    groups: {
      select: {
        type: true,
        id: true,
      },
    },
    isActive: true,
    createdAt: true,
  };

  async findOne(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async create(body: sendInviteDTO) {
    const found = await this.findOne(body.email);

    if (found) throw new BadRequestException('Duplicate email');

    if (body.groupIds?.length) {
      const count = await this.userGroupService.userGroupCount(body.groupIds);

      if (count !== body.groupIds.length)
        throw new NotFoundException('Group not found');
    }

    const user = await this.prisma.user.create({ data: body });

    if (body.groupIds)
      await this.userGroupService.updateUserIds(body.groupIds, user.id);

    return user;
  }

  async signup({ email, name, password }: SignUpDTO) {
    const salt = await genSalt(10);

    const hashed = await hash(password, salt);

    return this.prisma.user.update({
      where: { email },
      data: { email, name, password: hashed, isActive: true },
    });
  }

  async forgotPassword(email: string) {
    const found = await this.findOne(email);

    if (!found) throw new NotFoundException('Invalid email');

    if (!found.password)
      throw new BadRequestException('Please signup to continue');

    const otp = Math.random().toString(10).slice(2, 8);

    await this.prisma.otp.upsert({
      where: { email },
      create: { email, otp },
      update: { email, otp, createdAt: new Date(), status: OTPStatus.UNUSED },
    });

    this.emailService.sendMail({
      to: email,
      subject: 'Forgot password',
      template: 'forgotPassword',
      from: process.env.SMTP_FROM,
      context: {
        otp,
      },
    });
  }

  async changePassword(body: changePasswordDTO) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        otp: body.otp,
        status: OTPStatus.UNUSED,
        createdAt: { gte: new Date(new Date().getTime() - 10 * 60 * 1000) },
      },
    });

    if (!otp) throw new BadRequestException('Invalid otp');

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { status: OTPStatus.USED },
    });
    const salt = await genSalt(10);

    const hashed = await hash(body.password, salt);

    return this.prisma.user.update({
      where: { email: otp.email },
      data: { password: hashed },
    });
  }

  async getUserByEmails(emails: string[]) {
    return this.prisma.user.findMany({ where: { email: { in: emails } } });
  }

  async getAll(query: UserQueryDTO, userGroupId?: string) {
    const filter: Prisma.UserFindManyArgs = {
      where: { role: Role.USER },
      select: this.select,
    };

    if (userGroupId) filter.where.groupIds = { has: userGroupId };

    if (query.search)
      filter.where = {
        AND: [
          {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          },
          { role: Role.USER },
        ],
      };

    const [count, docs] = await Promise.all([
      this.prisma.user.count({ where: filter.where }),
      this.prisma.user.findMany({
        ...filter,
        ...UtilService.paginationProps(query),
      }),
    ]);
    const pagination = UtilService.paginate(count, query);
    return { pagination, docs };
  }

  async update(body: UpdateUserDTO, userId: string) {
    return Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: body,
      }),
      this.userGroupService.updateUserIds(body.groupIds, userId),
    ]);
  }

  async remove(id: string) {
    return Promise.all([
      this.prisma.user.delete({ where: { id } }),
      this.userGroupService.updateUserIds([], id),
    ]);
  }
}
