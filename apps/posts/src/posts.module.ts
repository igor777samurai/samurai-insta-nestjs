import { Module } from '@nestjs/common';
import { PostsController } from './api/controllers/posts.controller.ts';
import { PostsService } from './posts.service.js';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
