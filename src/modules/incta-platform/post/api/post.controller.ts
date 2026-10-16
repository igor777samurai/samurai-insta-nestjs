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

@Controller('post')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(
    @Query() query: any,
  ): Promise<any> {
    return 'getAll';
  }

  @Get(':id')
  async getById(
    @Param('id') id:any,
  ): Promise<any> {
    return id;
  }

  @Post()
  async create(@Body() dto: any): Promise<any> {
    return 'create post';
  }

  @Put(':id')
  async update(
    @Param('id') id: any
  ): Promise<any> {
    return 'update post'
  }

  @Delete(':id')
  async delete(@Param('id')id:any): Promise<any> {
    return 'deLETEE from post';
  }
}

