import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto, fileUploadSchema } from './file.dto';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';
import { GetUser } from '../users/users.decorator';
import { JWTPayload } from '../shared/types';
import { UtilService } from '../util/util.service';
import { Response } from 'express';
import { Public } from '../public/public.decorator';
import { diskStorage } from 'multer';
import { mkdir } from 'fs';
import { extname } from 'path';

@Controller('file')
@ApiTags('File')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly service: FileService) {}

  @ApiOperation({ summary: 'Universal file upload API' })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination(req, file, callback) {
          const dest = './src/upload';
          mkdir(dest, { recursive: true }, () => {
            callback(null, dest);
          });
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname);

          const name = `${new Date().getTime()}${ext}`;
          callback(null, name);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of files to upload',
    type: FilesUploadDto,
  })
  @UsePipes(new JoiBodyValidationPipe(fileUploadSchema))
  @Post()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: JWTPayload,
  ) {
    const uploaded = await this.service.upload(file, user);
    return UtilService.buildResponse(uploaded);
  }

  @Get(':key')
  @Public()
  async get(@Param('key') key: string, @Res() res: Response) {
    const item = await this.service.get(key);
    (item.Body as any).pipe(res);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'file id' })
  @ApiOperation({ summary: 'delete file' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);

    return UtilService.buildResponse();
  }
}
