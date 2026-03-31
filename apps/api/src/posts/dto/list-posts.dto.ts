import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import type { Lang, ListPostsQuery } from '@repo/types';

export class ListPostsQueryDto implements ListPostsQuery {
  @ApiProperty({ enum: ['ko', 'en'], example: 'ko', description: 'UI/content language for the response' })
  @IsIn(['ko', 'en'])
  lang!: Lang;

  @ApiPropertyOptional({ example: 'KR', description: 'Filter by country (ISO 3166-1 alpha-2)' })
  @IsString()
  @Length(2, 2)
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class AdminListPostsQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
