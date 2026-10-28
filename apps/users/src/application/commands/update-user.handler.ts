import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateUserCommand } from './update-user.command.ts';
import { PrismaUserRepository } from '../../infrastructure/prisma-user.repository.ts';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly usersRepository: PrismaUserRepository) {}

  async execute(command: UpdateUserCommand) {
    const { id, data } = command;

    const updateData = {
      ...(data.name !== undefined && {
        name: data.name.trim(),
      }),
      ...(data.email !== undefined && {
        email: data.email.trim().toLowerCase(),
      }),
    };

    return this.usersRepository.update(id, updateData);
  }
}
