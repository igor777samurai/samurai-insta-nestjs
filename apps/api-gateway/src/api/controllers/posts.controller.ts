import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
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

  // POST /api/posts — 201 Created
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() data: { authorId: number; caption?: string; imageUrl?: string },
  ) {
    return firstValueFrom(this.postsClient.send({ cmd: 'posts.create' }, data));
  }

  // GET /api/posts — 200 OK
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return firstValueFrom(this.postsClient.send({ cmd: 'posts.findAll' }, {}));
  }

  // GET /api/posts/:id — 200 OK
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      this.postsClient.send({ cmd: 'posts.findOne' }, { id }),
    );
  }

  // PATCH /api/posts/:id — 200 OK
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto) {
    return firstValueFrom(
      this.postsClient.send(
        { cmd: 'posts.update' },
        {
          id,
          ...data,
        },
      ),
    );
  }

  // DELETE /api/posts/:id — 204 No Content
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await firstValueFrom(
      this.postsClient.send({ cmd: 'posts.delete' }, { id }),
    );
  }
}
