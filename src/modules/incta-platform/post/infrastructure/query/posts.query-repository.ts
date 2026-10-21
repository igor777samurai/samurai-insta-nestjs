import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/paginated.view-dto.js';
import {PostViewDto} from "../../api/dto/post.view.js";
import {GetPostsQueryParams} from "../../api/dto/posts-query-params.input-dto.js";

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}


  async getAll(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter = {};

    const entities = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);

    const items = entities.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
