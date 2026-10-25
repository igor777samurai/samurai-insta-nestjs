import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @Min(1)
  authorId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  caption?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
