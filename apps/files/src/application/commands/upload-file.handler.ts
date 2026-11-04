import { UploadFileCommand } from './upload-file.command.ts';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileRepository } from '../../domain/repositories/file.repository.ts';
import { FileAggregate } from '../../domain/aggregates/files.aggregate.ts';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(command: UploadFileCommand) {
    const file = FileAggregate.create({
      originalName: command.originalName,
      mimeType: command.mimeType,
      size: command.data.length,
      userId: command.userId,
    });

    await this.fileRepository.save(file, command.data);

    return {
      id: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      createdAt: file.createdAt,
    };
  }
}
