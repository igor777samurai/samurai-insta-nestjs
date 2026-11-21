import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthMessageController } from './api/controllers/auth.message-controller';
import { PrismaModule } from '../../../core/prisma.module';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginHandler } from './application/commands/login.handler';
import { TokenHashService } from './infrastructure/security/token-hash.service';
import { LogoutHandler } from './application/commands/logout.handler';
import { GetMeHandler } from './application/queries/get-me.handler';
import { EmailVerificationService } from './infrastructure/security/email-verification.service';
import { VerifyEmailHandler } from './application/commands/verify-email.handler';
import { NodemailerService } from './infrastructure/email/nodemailer.service';
import { ResetDatabaseHandler } from './application/commands/reset-database.handler';
import { ForgotPasswordHandler } from './application/commands/forgot-password.handler';
import { PasswordResetService } from './infrastructure/security/password-reset.service';
import { PasswordHashService } from './infrastructure/security/password-hash.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule,
    PrismaModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthMessageController],
  providers: [
    PrismaAuthRepository,

    JwtTokenService,
    TokenHashService,
    EmailVerificationService,
    NodemailerService,
    PasswordResetService,
    PasswordHashService,

    RegisterUserHandler,
    LoginHandler,
    LogoutHandler,
    VerifyEmailHandler,
    ForgotPasswordHandler,

    ResetDatabaseHandler,

    GetMeHandler
  ],
})
export class AuthModule {}