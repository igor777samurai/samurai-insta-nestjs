import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller.ts';
import { UsersService } from './users.service.js';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
