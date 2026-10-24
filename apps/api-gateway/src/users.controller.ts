import {
  BadRequestException,
  ConflictException,
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { RegisterUserDto } from '../../users/src/api/dto/register-user.dto.ts';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    return firstValueFrom(
      this.usersClient
        .send({ cmd: 'users.register' }, data)
        .pipe(catchError((error) => this.handleRpcError(error))),
    );
  }

  private handleRpcError(error: {
    statusCode?: number;
    message?: string | string[];
  }) {
    if (error?.statusCode === 400) {
      return throwError(() => new BadRequestException(error.message));
    }

    if (error?.statusCode === 409) {
      return throwError(() => new ConflictException(error.message));
    }

    return throwError(() => new InternalServerErrorException());
  }
}