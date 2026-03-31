import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { CreatePostPayload } from '@repo/types';
import { TranslationUpsertItemDto } from './upsert-translation.dto';

export class CreatePostDto implements CreatePostPayload {
  @ApiProperty({ example: 'KR', description: 'ISO 3166-1 alpha-2 country code' })
  @IsString()
  @Length(2, 2)
  country_code!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({ type: () => TranslationUpsertItemDto, isArray: true, description: 'Initial translations to upsert atomically' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationUpsertItemDto)
  @IsOptional()
  translations?: TranslationUpsertItemDto[];
}
