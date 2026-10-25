import { CreatePostDto } from '../../api/dto/create-post.dto.ts';

export class CreatePostCommand {
  constructor(public readonly data: CreatePostDto) {}
}
