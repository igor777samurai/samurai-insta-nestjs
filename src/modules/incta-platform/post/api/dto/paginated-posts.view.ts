import { PostView } from './post.view.js';

export class PaginatedPostsView {
  items!: PostView[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
