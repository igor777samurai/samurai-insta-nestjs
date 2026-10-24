import { PostsController } from './posts.controller.ts';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [],
})
export class AppModule {}
