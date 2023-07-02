import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { JWTPayload } from '../shared/types';
import { Prisma } from '@prisma/client';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: process.env.AWS_REGION,
  });

  select: Prisma.FileSelect = {
    id: true,
    key: true,
    mimeType: true,
  };

  async get(key: string) {
    const command = new GetObjectCommand({
      Key: '/file/' + key,
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    return this.s3.send(command);
  }

  async upload(file: Express.Multer.File, user: JWTPayload) {
    const { key } = await this.uploadSingleFile(file.filename, file.mimetype);

    await rm(file.path);

    return this.prisma.file.create({
      data: { key, mimeType: file.mimetype, createdById: user.sub },
      select: this.select,
    });
  }

  async uploadSingleFile(filename: string, mimeType: string) {
    const key = '/file/' + filename;

    const stream = createReadStream('./src/upload/' + filename);

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: stream,
        Key: key,
        ContentType: mimeType,
      });

      await this.s3.send(command);

      return { key };
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  async remove(id: string) {
    const file = await this.prisma.file.delete({ where: { id } });

    if (!file) throw new NotFoundException('File not found');

    try {
      const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      };
      const command = new DeleteObjectCommand(input);
      await this.s3.send(command);
    } catch (error) {
      console.log(error);
    }
  }
}
