import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller.ts';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.ts';
import { FindAllUsersHandler } from './application/queries/find-all-users.handler.ts';
import { UpdateUserHandler } from './application/commands/update-user.handler.ts';
import { DeleteUserHandler } from './application/commands/delete-user.handler.ts';
import { CreateUserHandler } from './application/commands/create-user.handler.ts';
import {PrismaModule} from "../../../core/database/prisma.module.ts";
import {FindUserByIdHandler} from "./application/queries/find-user-by-id.handler.ts";

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UsersController],
  providers: [
    PrismaUserRepository,
    UpdateUserHandler,
    DeleteUserHandler,
    CreateUserHandler,
    FindAllUsersHandler,
    FindUserByIdHandler,
  ],
})
export class AppModule {}
