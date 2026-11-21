import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { GetMeQuery } from './get-me.query';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute(query: GetMeQuery) {
    const user = await this.authRepository.findById(query.userId);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    // Не возвращаем passwordHash и другие внутренние поля
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}