import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/paginated.view-dto.js';
import { PostsQueryRepository } from "../../infrastructure/query/posts.query-repository.js";
import { PostViewDto } from "../../api/dto/post.view.js";
import {GetPostsQueryParams} from "../../api/dto/posts-query-params.input-dto.js";

export class GetPostsQuery {
  constructor(public queryParams: GetPostsQueryParams) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<
  GetPostsQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(
    @Inject(PostsQueryRepository)
    private readonly queryRepository: PostsQueryRepository,
  ) {}

  async execute(
    query: GetPostsQuery,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryRepository.getAll(query.queryParams);
  }
}
