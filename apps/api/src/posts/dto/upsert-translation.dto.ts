import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';
import type { Lang, TranslationUpsertItem, UpsertTranslationPayload } from '@repo/types';

export class UpsertTranslationDto implements UpsertTranslationPayload {
  @ApiProperty({ example: '서울 여행기' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    example: '# 서울\n\n내용을 **마크다운**으로 작성하세요.',
    description: 'Full Markdown body',
  })
  @IsString()
  @MinLength(1)
  contents!: string;
}

/** Used for inline translation upsert within POST/PATCH /admin/posts. */
export class TranslationUpsertItemDto implements TranslationUpsertItem {
  @ApiProperty({ enum: ['ko', 'en'], example: 'ko' })
  @IsIn(['ko', 'en'])
  lang!: Lang;

  @ApiProperty({ example: '서울 여행기' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    example: '# 서울\n\n내용을 **마크다운**으로 작성하세요.',
    description: 'Full Markdown body',
  })
  @IsString()
  @MinLength(1)
  contents!: string;
}
