import { Module } from '@nestjs/common';
import { UsersMessageController } from './api/controllers/users.message-controller.ts';
import { UsersService } from './users.service.js';

@Module({
  imports: [],
  controllers: [UsersMessageController],
  providers: [UsersService],
})
export class UsersModule {}
