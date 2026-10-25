import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../../../../core/database/prisma.service.ts';
import { RegisterUserCommand } from './register-user.command.ts';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RegisterUserCommand) {
    const { name, email, password } = command.data;

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await argon2.hash(password);

    try {
      return await this.prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new RpcException({
          statusCode: 409,
          message: 'User with this email already exists',
        });
      }

      throw error;
    }
  }
}
