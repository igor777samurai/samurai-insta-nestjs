
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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
      @Inject('USERS_SERVICE')
      private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return firstValueFrom(
        this.usersClient.send(
            { cmd: 'users.findAll' },
            {},
        ),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
        this.usersClient.send(
            { cmd: 'users.findOne' },
            { id },
        ),
    );
  }

  @Post()
  create(@Body() data: unknown) {
    return firstValueFrom(
        this.usersClient.send(
            { cmd: 'users.create' },
            data,
        ),
    );
  }

  @Put(':id')
  update(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: unknown,
  ) {
    return firstValueFrom(
        this.usersClient.send(
            { cmd: 'users.update' },
            { id, data },
        ),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
        this.usersClient.send(
            { cmd: 'users.delete' },
            { id },
        ),
    );
  }
}
