import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly region: string;
  private readonly bucketName: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly domainName: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.domainName = configService.get<string>('AWS_CLOUDFRONT_DOMAIN_NAME');
    this.region = configService.get<string>('AWS_REGION');
    this.bucketName = configService.get<string>('AWS_BUCKET_NAME');

    const newClientConfigs = {
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    };

    this.s3Client = new S3Client(newClientConfigs);
  }

  async upload(file: Express.Multer.File) {
    const fileName = this.getUniqueFilename(file.originalname);

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(params));

    const fileUrl = `${this.domainName}/${fileName}`;

    return fileUrl;
  }

  async generateSignedUrl(fileURL: string) {
    const fileKey = fileURL.split('/').pop(); // ! Getting actually file name

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const oneHour = 60 * 60 * 1; // 1 hour in seconds
    return getSignedUrl(this.s3Client, command, { expiresIn: oneHour });
  }

  private getUniqueFilename(originalName: string) {
    const ext = originalName.split('.')[originalName.split('.').length - 1];

    const randomString = Date.now().valueOf();

    return `${randomString}.${ext}`;
  }
}
