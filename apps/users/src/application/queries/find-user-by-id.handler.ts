import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from './find-user-by-id.query.ts';
import { PrismaUserRepository } from '../../infrastructure/prisma-user.repository.ts';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(private readonly usersRepository: PrismaUserRepository) {}

  async execute(query: FindUserByIdQuery) {
    return this.usersRepository.findById(query.id);
  }
}
