import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller.ts';
import { PrismaModule } from './infrastructure/database/prisma.module.ts';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterUserHandler } from './application/commands/register-user.handler.ts';

@Module({
  imports: [ CqrsModule, PrismaModule],
  controllers: [UsersController],
  providers: [RegisterUserHandler],
})
export class AppModule {}
