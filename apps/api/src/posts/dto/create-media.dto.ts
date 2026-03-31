import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import type { CreateMediaPayload, MediaType } from '@repo/types';

export class CreateMediaDto implements CreateMediaPayload {
  @ApiProperty({ enum: ['image', 'video', 'embed'], example: 'image' })
  @IsIn(['image', 'video', 'embed'])
  type!: MediaType;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({ example: 'A flag waving in the wind', description: 'Alt text for accessibility' })
  @IsString()
  @IsOptional()
  alt_text?: string;

  @ApiPropertyOptional({ example: 'Sunset over Namsan Tower' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}
