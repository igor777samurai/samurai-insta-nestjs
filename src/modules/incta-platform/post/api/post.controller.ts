import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPostsInput } from './dto/update-post.input.js';
import { GetPostsQuery } from '../application/queries/get-posts.query-handler.js';

@Controller('post')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  getAll(@Query() input: GetPostsInput) {
    return this.queryBus.execute(new GetPostsQuery(input));
  }

  @Get(':id')
  async getById(@Param('id') id: any): Promise<any> {
    return id;
  }

  @Post()
  async create(@Body() dto: any): Promise<any> {
    return 'create post';
  }

  @Put(':id')
  async update(@Param('id') id: any): Promise<any> {
    return 'update post';
  }

  @Delete(':id')
  async delete(@Param('id') id: any): Promise<any> {
    return 'deLETEE from post';
  }
}

