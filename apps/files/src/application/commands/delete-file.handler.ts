import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from './delete-file.command.ts';
import { FileRepository } from '../../domain/repositories/file.repository.ts';
import { Inject } from '@nestjs/common';
import { FILE_REPOSITORY } from '../../domain/repositories/file.repository.token.ts';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<
  DeleteFileCommand,
  void
> {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(command: DeleteFileCommand): Promise<void> {
    await this.fileRepository.delete(command.fileId, command.userId);
  }
}
