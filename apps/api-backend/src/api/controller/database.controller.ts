
import {
  Controller,
  Delete,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Delete('reset')
  @ApiOperation({
    summary: 'Reset database',
    description: 'Deletes all application data without removing database structure.',
  })
  @ApiResponse({
    status: 200,
    description: 'Database successfully reset.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async resetDatabase() {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'database.reset' }, {})
        .pipe(
          catchError(() =>
            throwError(() => new InternalServerErrorException()),
          ),
        ),
    );
  }
}
