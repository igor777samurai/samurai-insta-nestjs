import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { UsersController } from './api/controllers/users.controller.ts';
import { PostsController } from './api/controllers/posts.controller.ts';
import { AuthController } from './api/controllers/auth.controller.ts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {ApiGatewayController} from "./api-gateway.controller.ts";
import {ApiGatewayService} from "./api-gateway.service.ts";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),

    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3001,
          },
        }),
      },
      {
        name: 'POSTS_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3002,
          },
        }),
      },
      {
        name: 'AUTH_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3003,
          },
        }),
      },
      {
        name: 'FILES_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rabbitMQUrl = configService.get<string>('RABBITMQ_URL');

          if (!rabbitMQUrl) {
            throw new Error('RABBITMQ_URL is not defined');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMQUrl],
              queue: 'files_queue',
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [
    UsersController,
    PostsController,
    AuthController,
    ApiGatewayController,
  ],
  providers: [ApiGatewayService],
})
export class AppModule {}