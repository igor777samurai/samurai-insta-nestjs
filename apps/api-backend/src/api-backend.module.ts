import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiBackendController } from './api-backend.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ApiBackendController],
  providers: [],
})
export class ApiBackendModule {}