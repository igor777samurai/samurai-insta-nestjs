import { AuthController } from './api/controller/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TestController } from './api/controller/test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'api-auth-service',
          port:  Number(process.env.AUTH_SERVICE_PORT || '4467'),
        },
      },
    ]),
  ],
  controllers: [AuthController, TestController],
})
export class ApiBackendModule {}