export interface CreatePostData {
  authorId: number;
  caption?: string;
  imageUrl?: string;
}

export class CreatePostCommand {
  constructor(public readonly data: CreatePostData) {}
}
