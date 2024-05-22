import { BadRequestException, Injectable } from '@nestjs/common';
import { IAppService } from './interfaces/app-service.interface';
import { File } from './entities/File.entity';
import { S3Service } from './s3/s3.service';

@Injectable()
export class AppService implements IAppService {
  private files: File[] = [];
  constructor(private readonly s3Service: S3Service) {}
  async saveFileToCache(fileURL: string) {
    const fileId = this.generateID();

    this.files.push({ id: fileId, url: fileURL });

    return { id: fileId, url: fileURL };
  }

  async getFilesFromCache() {
    return this.files;
  }

  async getFileSignedURL(id: number) {
    const file = this.files.find((file) => file.id == id);
    if (!file) {
      throw new BadRequestException('File not found');
    }

    return this.s3Service.generateSignedUrl(file.url);
  }

  private generateID() {
    return Date.now().valueOf();
  }
}
