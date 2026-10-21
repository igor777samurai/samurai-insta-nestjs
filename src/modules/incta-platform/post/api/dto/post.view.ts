export class PostViewDto {
  id!: string;
  title!: string;
  content!: string;
  createdAt!: string;
  updatedAt!: string;

  static mapToView(blog: any): PostViewDto {
    const dto = new PostViewDto();
    dto.id = blog._id.toString();
    return dto;
  }
}
