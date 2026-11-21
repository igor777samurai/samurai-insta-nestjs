
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';
import { RegisterUserCommand } from './register-user.command';
import { EmailVerificationService } from '../../infrastructure/security/email-verification.service';
import { NodemailerService } from '../../infrastructure/email/nodemailer.service';
import { PasswordHashService } from '../../infrastructure/security/password-hash.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly nodemailerService: NodemailerService,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      acceptedTerms,
    } = command.data;

    if (password !== passwordConfirmation) {
      throw new RpcException({
        statusCode: 400,
        message: 'Passwords do not match',
      });
    }

    if (!acceptedTerms) {
      throw new RpcException({
        statusCode: 400,
        message: 'You must accept the Terms of Service and Privacy Policy',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser =
      await this.authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email already registered',
      });
    }

    const passwordHash = await this.passwordHashService.hash(password);

    const { token, tokenData } =
      this.emailVerificationService.createTokenData();

    const user = await this.authRepository.createUserWithEmailVerificationToken(
      {
        name: username.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      tokenData,
    );

    try {
      await this.nodemailerService.sendRegistrationEmail(
        user.email,
        token,
      );
    } catch (error) {
      console.error('Send registration email error:', error);
    }

    return {
      id: user.id,
      username: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
