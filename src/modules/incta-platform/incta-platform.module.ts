import { Module } from '@nestjs/common';
import {PostController} from "./post/api/post.controller.js";
import { CqrsModule } from '@nestjs/cqrs';
import {UserController} from "./user/api/user.controller.js";

@Module({
  imports: [CqrsModule],
  controllers: [PostController, UserController],
  providers: [],
})
export class InctaPlatformModule {}
