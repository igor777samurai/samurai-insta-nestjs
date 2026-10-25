import { UpdatePostDto } from '../../api/dto/update-post.dto.ts';

export class UpdatePostCommand {
  constructor(
    public readonly id: number,
    public readonly data: UpdatePostDto,
  ) {}
}
