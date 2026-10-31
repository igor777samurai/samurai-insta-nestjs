import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './profile/api/profile.controller.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProfileController],
  providers: [],
})
export class AccountModule {}
