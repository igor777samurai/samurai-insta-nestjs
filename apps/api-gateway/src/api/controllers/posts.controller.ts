import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

class UpdatePostDto {}

@Controller('posts')
export class PostsController {
  constructor(
    @Inject('POSTS_SERVICE')
    private readonly postsClient: ClientProxy,
  ) {}

  @Post()
  create(
    @Body() data: { authorId: number; caption?: string; imageUrl?: string },
  ) {
    return firstValueFrom(this.postsClient.send({ cmd: 'posts.create' }, data));
  }

  @Get()
  findAll() {
    return firstValueFrom(this.postsClient.send({ cmd: 'posts.findAll' }, {}));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.postsClient.send({ cmd: 'posts.findOne' }, { id: Number(id) }),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePostDto) {
    return firstValueFrom(
      this.postsClient.send(
        { cmd: 'posts.update' },
        {
          id: Number(id),
          ...data,
        },
      ),
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return firstValueFrom(
      this.postsClient.send({ cmd: 'posts.delete' }, { id: Number(id) }),
    );
  }
}
