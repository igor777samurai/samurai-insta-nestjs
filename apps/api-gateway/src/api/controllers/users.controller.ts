  import {
    BadRequestException,
    ConflictException,
    Controller,
    Post,
    Body,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { Inject } from '@nestjs/common';
  import { firstValueFrom, catchError, throwError } from 'rxjs';
  import { RegisterUserDto } from '../../../../users/src/api/dto/register-user.dto.ts';

  @Controller('users')
  export class UsersController {
    private readonly logger = new Logger(UsersController.name);

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

    private handleRpcError(error: unknown) {
      this.logger.error(
        'Registration request failed',
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      const rpcError = this.normalizeRpcError(error);

      if (rpcError.statusCode === 400) {
        return throwError(() => new BadRequestException(rpcError.message));
      }

      if (rpcError.statusCode === 409) {
        return throwError(() => new ConflictException(rpcError.message));
      }

      return throwError(
        () => new InternalServerErrorException('Registration failed'),
      );
    }

    private normalizeRpcError(error: unknown): {
      statusCode?: number;
      message?: string | string[];
    } {
      if (!error || typeof error !== 'object') {
        return {};
      }

      const candidate = error as {
        statusCode?: number;
        message?: string | string[];
        error?: {
          statusCode?: number;
          message?: string | string[];
        };
      };

      return {
        statusCode: candidate.statusCode ?? candidate.error?.statusCode,
        message: candidate.message ?? candidate.error?.message,
      };
    }
  }
