import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../core/database/prisma.module.ts';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthMessageController } from './api/controllers/auth.message-controller.ts';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository.ts';
import { LoginHandler } from './application/commands/login.handler.ts';
import { RegisterUserHandler } from './application/commands/register-user.handler.ts';
import { JwtTokenService } from './infrastructure/security/jwt-token.service.ts';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CqrsModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
    JwtModule.register({}),],
  controllers: [AuthMessageController],
  providers: [PrismaAuthRepository, JwtTokenService, LoginHandler, RegisterUserHandler],
  exports: [PrismaAuthRepository],
})
export class AuthModule {}
