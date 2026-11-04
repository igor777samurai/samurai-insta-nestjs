
import { NotFoundException } from '@nestjs/common';
import { DownloadFileQuery } from './download-file.query.ts';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileRepository } from '../../domain/repositories/file.repository.ts';

@QueryHandler(DownloadFileQuery)
export class DownloadFileHandler implements IQueryHandler<DownloadFileQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: DownloadFileQuery) {
    const result = await this.fileRepository.findById(query.id);

    if (!result || result.file.userId !== query.userId) {
      throw new NotFoundException('File not found');
    }

    return {
      id: result.file.id,
      originalName: result.file.originalName,
      mimeType: result.file.mimeType,
      size: result.file.size,
      data: result.data.toString('base64'),
    };
  }
}
