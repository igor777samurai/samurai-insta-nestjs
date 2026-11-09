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
    RegisterUserHandler,
    LoginHandler,
  ],
})
export class AuthModule {}