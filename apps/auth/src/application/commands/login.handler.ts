import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from './login.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { JwtTokenService } from '../../infrastructure/security/jwt-token.service';
import { TokenHashService } from '../../infrastructure/security/token-hash.service';
import { RpcException } from '@nestjs/microservices';
import { PasswordHashService } from '../../infrastructure/security/password-hash.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly tokenHashService: TokenHashService,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.data;

    const user = await this.authRepository.findByEmail(
      email.trim().toLowerCase(),
    );

    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await this.passwordHashService.verify(
      user.passwordHash,
      password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }

    if (!user.isEmailVerified) {
      throw new RpcException({
        statusCode: 403,
        message: 'Please verify your email before logging in',
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.generateAccessToken(payload),
      this.jwtTokenService.generateRefreshToken(payload),
    ]);

    const tokenHash = this.tokenHashService.hash(refreshToken);

    await this.authRepository.createRefreshToken({
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

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