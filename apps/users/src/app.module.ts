import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller.ts';
import { PrismaModule } from '../../core/database/prisma.module.ts';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterUserHandler } from './application/commands/register-user.handler.ts';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.ts';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UsersController],
  providers: [RegisterUserHandler, PrismaUserRepository],
})
export class AppModule {}
