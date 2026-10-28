import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCommand } from './delete-user.command.ts';
import { PrismaUserRepository } from '../../infrastructure/prisma-user.repository.ts';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: PrismaUserRepository) {}

  async execute(command: DeleteUserCommand) {
    return this.usersRepository.delete(command.id);
  }
}
