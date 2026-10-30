import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

import PrismaPostRepository from '../../infrastructure/prisma-post.repository.ts';
import { GetPostByIdQuery } from './get-post-by-id.query.ts';

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postRepository: PrismaPostRepository) {}

  async execute(query: GetPostByIdQuery) {
    const post = await this.postRepository.findById(query.id);

    if (!post) {
      throw new RpcException({
        statusCode: 404,
        message: 'Post not found',
      });
    }

    return post;
  }
}
