import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Inject,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../../../../users/src/api/dto/create-user.dto.ts';
import { UpdateUserDto } from '../../../../users/src/api/dto/update-user.dto.ts';


@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  // GET /api/users
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return firstValueFrom(this.usersClient.send({ cmd: 'users.findAll' }, {}));
  }

  // GET /api/users/:id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'users.findOne' }, { id }),
    );
  }

  // POST /api/users
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDto) {
    return firstValueFrom(this.usersClient.send({ cmd: 'users.create' }, data));
  }

  // PUT /api/users/:id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'users.update' }, { id, data }),
    );
  }

  // DELETE /api/users/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await firstValueFrom(
      this.usersClient.send({ cmd: 'users.delete' }, { id }),
    );
  }
}
