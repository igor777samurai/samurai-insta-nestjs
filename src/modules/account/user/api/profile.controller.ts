import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(@Query() query: any): Promise<any> {
    return 'getAll profile';
  }

  @Get(':id')
  async getById(@Param('id') id: any): Promise<any> {
    return id;
  }

  @Post()
  async create(@Body() dto: any): Promise<any> {
    return 'create profile';
  }

  @Put(':id')
  async update(@Param('id') id: any): Promise<any> {
    return 'update profile';
  }

  @Delete(':id')
  async delete(@Param('id') id: any): Promise<any> {
    return 'deLETEE from user';
  }
}