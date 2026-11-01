import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { RegisterUserCommand } from './register-user.command.ts';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository.ts';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly authRepository: PrismaAuthRepository) {}

  async execute(command: RegisterUserCommand) {
    const { name, email, password } = command.data;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(password);

    return this.authRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });
  }
}
