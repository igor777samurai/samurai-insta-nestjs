import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { LogoutCommand } from './logout.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { TokenHashService } from '../../infrastructure/security/token-hash.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly tokenHashService: TokenHashService,
  ) {}

  async execute(command: LogoutCommand) {
    const { refreshToken } = command;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenHash = this.tokenHashService.hash(refreshToken);

    const storedToken =
      await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRepository.revokeRefreshTokenByHash(tokenHash);

    return {
      message: 'Successfully logged out',
    };
  }
}