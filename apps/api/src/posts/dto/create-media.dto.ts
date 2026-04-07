import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import type { CreateMediaPayload, MediaType, UpdateMediaPayload } from '@repo/types';

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

  @ApiPropertyOptional({ example: 100, description: 'Display width as percentage (10–100)' })
  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  width?: number;
}

export class UpdateMediaDto implements UpdateMediaPayload {
  @ApiPropertyOptional({ example: 50, description: 'Display width as percentage (10–100)' })
  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  width?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alt_text?: string;
}
