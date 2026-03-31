import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import type { UpdatePostPayload } from '@repo/types';
import { TranslationUpsertItemDto } from './upsert-translation.dto';

export class UpdatePostDto implements UpdatePostPayload {
  @ApiPropertyOptional({ example: 'JP', description: 'ISO 3166-1 alpha-2 country code' })
  @IsString()
  @Length(2, 2)
  @IsOptional()
  country_code?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', nullable: true })
  @IsUrl()
  @IsOptional()
  cover_url?: string | null;

  @ApiPropertyOptional({ type: () => TranslationUpsertItemDto, isArray: true, description: 'Translations to upsert atomically' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationUpsertItemDto)
  @IsOptional()
  translations?: TranslationUpsertItemDto[];
}
