import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command.ts';
import { PrismaUserRepository } from '../../infrastructure/prisma-user.repository.ts';
import * as argon2 from 'argon2';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersRepository: PrismaUserRepository) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command.data;

    const passwordHash = await argon2.hash(password);

    return this.usersRepository.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
  }
}
