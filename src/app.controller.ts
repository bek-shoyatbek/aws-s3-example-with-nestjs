import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3/s3.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToS3(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.s3Service.upload(file);

    return await this.appService.saveFileToCache(fileUrl);
  }

  @Get('files')
  async getFilesFromCache() {
    return await this.appService.getFilesFromCache();
  }

  @Get('get-signed-url/:id')
  async getFileSignedURL(@Param('id') id: number) {
    return await this.appService.getFileSignedURL(id);
  }
}
