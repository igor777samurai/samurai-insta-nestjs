import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreatePostInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    title!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20_000)
    content!: string;
}