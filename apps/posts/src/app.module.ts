import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PostsController } from './api/controllers/posts.controller.ts';
import PrismaPostRepository from './infrastructure/prisma-post.repository.ts';
import { CreatePostHandler } from './application/commands/create-post.handler.ts';
import { GetPostsHandler } from './application/queries/get-posts.handler.ts';
import { GetPostByIdHandler } from './application/queries/get-post-by-id.handler.ts';
import { UpdatePostHandler } from './application/commands/update-post.handler.ts';
import { DeletePostHandler } from './application/commands/delete-post.handler.ts';
import { PrismaModule } from '../../../core/database/prisma.module.ts';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [PostsController],
  providers: [
    PrismaPostRepository,
    CreatePostHandler,
    GetPostsHandler,
    GetPostByIdHandler,
    UpdatePostHandler,
    DeletePostHandler,
  ],
})
export class AppModule {}
