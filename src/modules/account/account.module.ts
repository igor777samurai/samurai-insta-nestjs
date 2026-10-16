import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {UserController} from "./api/user.controller.js";

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [],
})
export class AccountModule {}
