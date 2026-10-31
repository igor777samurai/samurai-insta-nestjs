import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/paginated.view-dto.js';
import { PostViewDto } from '../../api/dto/post.view.js';
import { GetPostsQueryParams } from '../../api/dto/posts-query-params.input-dto.js';

@Injectable()
export class PostsQueryRepository {
  async getAll(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    // 1. Создаем массив фейковых сырых данных, имитирующих документы из MongoDB
    const mockEntities = Array.from({ length: 25 }, (_, index) => ({
      _id: `mock-id-${index + 1}`,
      title: `Stub Post Title ${index + 1}`,
      content: `This is a stub content for mock post number ${index + 1}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // 2. Имитируем общее количество документов в базе данных
    const totalCount = mockEntities.length;

    // 3. Вычисляем срез массива на основе параметров пагинации из query
    const pageSize = query.pageSize || 10;
    const pageNumber = query.pageNumber || 1;

    // Используем встроенный метод calculateSkip или считаем вручную, если метод недоступен
    const skip =
      typeof query.calculateSkip === 'function'
        ? query.calculateSkip()
        : (pageNumber - 1) * pageSize;

    const paginatedEntities = mockEntities.slice(skip, skip + pageSize);

    // 4. Мапим фейковые сущности в PostViewDto (исправлено с BlogViewDto на PostViewDto)
    const items = paginatedEntities.map((entity) =>
      PostViewDto.mapToView(entity),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: pageNumber,
      size: pageSize,
    });
  }
}
