import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alex' })
  name: string;

  @ApiProperty({ example: 'alex@example.com' })
  email: string;

  @ApiProperty({
    example: '2026-11-12T12:00:00.000Z',
  })
  createdAt: Date;
}