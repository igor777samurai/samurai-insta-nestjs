import { Command } from '@nestjs/cqrs';

export class DeleteFileCommand extends Command<void> {
  constructor(
    public readonly fileId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
