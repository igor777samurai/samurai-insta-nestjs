import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(@Query() query: any): Promise<any> {
    return 'getAll user';
  }

  @Get(':id')
  async getById(@Param('id') id: any): Promise<any> {
    return id;
  }

  @Post()
  async create(@Body() dto: any): Promise<any> {
    return 'create user';
  }

  @Put(':id')
  async update(@Param('id') id: any): Promise<any> {
    return 'update user';
  }

  @Delete(':id')
  async delete(@Param('id') id: any): Promise<any> {
    return 'deLETEE from user';
  }
}