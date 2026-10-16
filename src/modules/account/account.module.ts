import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './user/api/profile.controller.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProfileController],
  providers: [],
})
export class AccountModule {}
