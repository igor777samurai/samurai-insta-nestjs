import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

import { VerifyEmailCommand } from './verify-email.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { TokenHashService } from '../../infrastructure/security/token-hash.service';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler
  implements ICommandHandler<VerifyEmailCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly tokenHashService: TokenHashService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const tokenHash = this.tokenHashService.hash(command.token);

    const verificationToken =
      await this.authRepository.findEmailVerificationTokenByHash(tokenHash);

    if (
      !verificationToken ||
      verificationToken.usedAt ||
      verificationToken.expiresAt < new Date()
    ) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid or expired email verification token',
      });
    }

    await this.authRepository.markEmailVerificationTokenAsUsed(tokenHash);

    const user = await this.authRepository.verifyUserEmail(
      verificationToken.userId,
    );

    return {
      id: user.id,
      username: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
