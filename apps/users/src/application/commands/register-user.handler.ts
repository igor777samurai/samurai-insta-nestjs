import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { RegisterUserCommand } from './register-user.command.ts';
import {PrismaUserRepository} from "../../infrastructure/prisma-user.repository.ts";

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute(command: RegisterUserCommand) {
    const { name, email, password } = command.data;

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await argon2.hash(password);

    try {
      return await this.userRepository.create({
        name,
        email: normalizedEmail,
        passwordHash,
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
