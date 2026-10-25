import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UsersController } from './api/controllers/users.controller.ts';
import { PostsController } from './api/controllers/posts.controller.ts';

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
    ]),
  ],
  controllers: [UsersController, PostsController],
})
export class AppModule {}
