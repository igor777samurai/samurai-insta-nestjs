import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from './find-all-users.query.ts';
import { PrismaUserRepository } from '../../infrastructure/prisma-user.repository.ts';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(private readonly usersRepository: PrismaUserRepository) {}

  async execute() {
    return this.usersRepository.findAll();
  }
}
