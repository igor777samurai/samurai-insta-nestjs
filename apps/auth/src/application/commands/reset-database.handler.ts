
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ResetDatabaseCommand } from './reset-database.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@CommandHandler(ResetDatabaseCommand)
export class ResetDatabaseHandler
  implements ICommandHandler<ResetDatabaseCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute() {
    await this.authRepository.resetDatabase();

    return {
      message: 'Database successfully reset',
    };
  }
}
