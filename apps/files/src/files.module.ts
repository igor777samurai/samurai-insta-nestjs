import { Module } from '@nestjs/common';
import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';
import { UploadFileHandler } from './application/commands/upload-file.handler.ts';
import { DownloadFileHandler } from './application/queries/download-file.handler.ts';
import { DeleteFileHandler } from './application/commands/delete-file.handler.ts';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService, UploadFileHandler, DownloadFileHandler, DeleteFileHandler],
})
export class FilesModule {}
