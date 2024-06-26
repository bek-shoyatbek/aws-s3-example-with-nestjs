import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [S3Module],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {}
