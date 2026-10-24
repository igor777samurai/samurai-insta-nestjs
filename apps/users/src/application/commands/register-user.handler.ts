import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../../infrastructure/database/prisma.service.ts';
import { RegisterUserCommand } from './register-user.command.ts';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RegisterUserCommand) {
    const { name, email, password } = command.data;

    const passwordHash = await argon2.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with this email already exists');
      }

      throw error;
    }
  }
}
