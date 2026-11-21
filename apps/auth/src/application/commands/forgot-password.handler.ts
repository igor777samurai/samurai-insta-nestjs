import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ForgotPasswordCommand } from './forgot-password.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { PasswordResetService } from '../../infrastructure/security/password-reset.service';
import { NodemailerService } from '../../infrastructure/email/nodemailer.service';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly passwordResetService: PasswordResetService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const user = await this.authRepository.findByEmail(command.email);

    // Не раскрываем, существует ли пользователь с таким email.
    if (!user) {
      return;
    }

    const { token, tokenData } =
      this.passwordResetService.createTokenData();

    await this.authRepository.createPasswordResetToken({
      ...tokenData,
      userId: user.id,
    });

    await this.nodemailerService.sendPasswordResetEmail(
      user.email,
      token,
    );
  }
}