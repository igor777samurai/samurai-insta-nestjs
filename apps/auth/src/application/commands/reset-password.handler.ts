import {
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ResetPasswordCommand } from './reset-password.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { TokenHashService } from '../../infrastructure/security/token-hash.service';
import { PasswordHashService } from '../../infrastructure/security/password-hash.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly tokenHashService: TokenHashService,
    private readonly passwordService: PasswordHashService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const tokenHash = this.tokenHashService.hash(command.token);

    const newPasswordHash = await this.passwordService.hash(
      command.newPassword,
    );

    const isReset = await this.authRepository.resetPasswordWithToken(
      tokenHash,
      newPasswordHash,
    );

    if (!isReset) {
      throw new BadRequestException(
        'Password reset link is invalid or expired',
      );
    }
  }
}