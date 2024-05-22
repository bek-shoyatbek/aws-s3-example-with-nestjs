import { File } from 'src/entities/File.entity';

export interface IAppService {
  saveFileToCache(fileURL: string): Promise<File>;
  getFilesFromCache(): Promise<File[] | null>;
  getFileSignedURL(fileId: number): Promise<string>;
}
