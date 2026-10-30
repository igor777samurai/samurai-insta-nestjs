import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import PrismaPostRepository from '../../infrastructure/prisma-post.repository.ts';
import { GetPostsQuery } from './get-posts.query.ts';

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postRepository: PrismaPostRepository) {}

  async execute(_query: GetPostsQuery) {
    return this.postRepository.findAll();
  }
}
