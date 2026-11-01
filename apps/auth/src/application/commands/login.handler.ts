import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { LoginCommand } from './login.command.ts';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository.ts';
import { JwtTokenService } from '../../infrastructure/security/jwt-token.service.ts';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.data;

    const user = await this.authRepository.findByEmail(
      email.trim().toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);

    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}