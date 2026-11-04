import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UsersController } from './api/controllers/users.controller.ts';
import { PostsController } from './api/controllers/posts.controller.ts';
import { AuthController } from './api/controllers/auth.controller.ts';

const rabbitMQUrl = process.env.RABBITMQ_URL;

if (!rabbitMQUrl) {
  throw new Error('RABBITMQ_URL is not defined');
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
      {
        name: 'POSTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3002,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3003,
        },
      },
      {
        name: 'FILES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMQUrl],
          queue: 'files_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [UsersController, PostsController, AuthController],
})
export class AppModule {}