import { Module } from '@nestjs/common';
import {PostController} from "./post/api/post.controller.js";
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [],
})
export class InctaPlatformModule {}
