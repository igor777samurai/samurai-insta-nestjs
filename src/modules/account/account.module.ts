import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {UserController} from "./user/api/user.controller.js";

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [],
})
export class AccountModule {}
