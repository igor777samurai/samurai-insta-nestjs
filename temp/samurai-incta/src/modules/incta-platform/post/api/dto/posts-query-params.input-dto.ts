
import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto.js';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}


export class GetPostsQueryParams extends BaseQueryParams {
  @IsEnum(PostsSortBy)
  sortBy = PostsSortBy.CreatedAt;
}
