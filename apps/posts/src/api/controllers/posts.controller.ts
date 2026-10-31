import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreatePostCommand } from '../../application/commands/create-post.command.ts';
import { CreatePostDto } from '../dto/create-post.dto.ts';
import { GetPostsQuery } from '../../application/queries/get-posts.query.ts';
import { GetPostByIdQuery } from '../../application/queries/get-post-by-id.query.ts';
import { UpdatePostCommand } from '../../application/commands/update-post.command.ts';
import { DeletePostCommand } from '../../application/commands/delete-post.command.ts';

@Controller()
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'posts.create' })
  create(@Payload() dto: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(dto));
  }

  @MessagePattern({ cmd: 'posts.findAll' })
  findAll() {
    return this.queryBus.execute(new GetPostsQuery());
  }

  @MessagePattern({ cmd: 'posts.findOne' })
  findOne(@Payload() data: { id: number }) {
    return this.queryBus.execute(new GetPostByIdQuery(data.id));
  }

  @MessagePattern({ cmd: 'posts.update' })
  update(
    @Payload()
    data: {
      id: number;
      caption?: string | null;
      imageUrl?: string | null;
    },
  ) {
    const { id, ...updateData } = data;

    return this.commandBus.execute(new UpdatePostCommand(id, updateData));
  }

  @MessagePattern({ cmd: 'posts.delete' })
  delete(@Payload() data: { id: number }) {
    return this.commandBus.execute(new DeletePostCommand(data.id));
  }
}
