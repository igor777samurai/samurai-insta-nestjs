import { PostViewDto } from './post.view.js';

export class PaginatedPostsView {
  items!: PostViewDto[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
