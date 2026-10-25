import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  caption?: string | null;

  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  imageUrl?: string | null;
}
