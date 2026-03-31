import { ApiProperty } from '@nestjs/swagger';

// ─── Country ──────────────────────────────────────────────────────────────────

export class CountrySchema {
  @ApiProperty({ example: 'KR' })
  code!: string;

  @ApiProperty({ example: 'South Korea' })
  name_en!: string;

  @ApiProperty({ example: 'https://flagcdn.com/kr.svg' })
  flag_url!: string;
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export class PostSchema {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'KR' })
  country_code!: string;

  @ApiProperty({ example: false })
  published!: boolean;

  @ApiProperty({ example: 'https://example.com/cover.jpg', nullable: true })
  cover_url!: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updated_at!: string;
}

// ─── PostListTranslation (lean — no contents) ─────────────────────────────────

export class PostListTranslationSchema {
  @ApiProperty({ example: 1 })
  post_id!: number;

  @ApiProperty({ example: 'ko', enum: ['ko', 'en'] })
  lang!: string;

  @ApiProperty({ example: '서울 여행기' })
  title!: string;

  @ApiProperty({ example: '서울의 골목골목을 걸으며 느낀 생생한 여행 이야기.', nullable: true })
  excerpt!: string | null;
}

// ─── PostTranslation (full — with contents) ───────────────────────────────────

export class PostTranslationSchema {
  @ApiProperty({ example: 1 })
  post_id!: number;

  @ApiProperty({ example: 'ko', enum: ['ko', 'en'] })
  lang!: string;

  @ApiProperty({ example: '서울 여행기' })
  title!: string;

  @ApiProperty({ example: '서울의 골목골목을 걸으며 느낀 생생한 여행 이야기.', nullable: true })
  excerpt!: string | null;

  @ApiProperty({ example: '# 서울\n\n내용을 **마크다운**으로 작성하세요.', description: 'Markdown body' })
  contents!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updated_at!: string;
}

// ─── PostMedia ────────────────────────────────────────────────────────────────

export class PostMediaSchema {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  post_id!: number;

  @ApiProperty({ example: 'image', enum: ['image', 'video', 'embed'] })
  type!: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  url!: string;

  @ApiProperty({ example: 'A flag waving in the wind', nullable: true })
  alt_text!: string | null;

  @ApiProperty({ example: 'Sunset over Namsan Tower', nullable: true })
  caption!: string | null;

  @ApiProperty({ example: 0 })
  display_order!: number;
}

// ─── Public list view ─────────────────────────────────────────────────────────

export class PostListItemSchema extends PostSchema {
  @ApiProperty({ type: () => PostListTranslationSchema, description: 'Lean translation (no contents)' })
  translation!: PostListTranslationSchema;

  @ApiProperty({ type: () => CountrySchema })
  country!: CountrySchema;
}

// ─── Public detail view ───────────────────────────────────────────────────────

export class PostDetailSchema extends PostSchema {
  @ApiProperty({ type: () => PostTranslationSchema, description: 'Full translation for the requested lang' })
  translation!: PostTranslationSchema;

  @ApiProperty({ type: () => CountrySchema })
  country!: CountrySchema;

  @ApiProperty({ type: () => PostMediaSchema, isArray: true })
  media!: PostMediaSchema[];
}

// ─── Admin list view ──────────────────────────────────────────────────────────

export class AdminPostListItemSchema extends PostSchema {
  @ApiProperty({ type: () => CountrySchema })
  country!: CountrySchema;

  @ApiProperty({ example: ['ko', 'en'], description: 'Languages that have been authored' })
  available_langs!: string[];
}

// ─── Admin detail view ────────────────────────────────────────────────────────

export class AdminPostDetailSchema extends PostSchema {
  @ApiProperty({ type: () => CountrySchema })
  country!: CountrySchema;

  @ApiProperty({ type: () => PostTranslationSchema, isArray: true })
  translations!: PostTranslationSchema[];

  @ApiProperty({ type: () => PostMediaSchema, isArray: true })
  media!: PostMediaSchema[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export class AuthUserSchema {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'admin', nullable: true })
  role!: string | null;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z', format: 'date-time' })
  created_at!: string;
}

export class LoginResponseSchema {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token!: string;

  @ApiProperty({ example: 3600, description: 'Token lifetime in seconds' })
  expires_in!: number;

  @ApiProperty({ type: () => AuthUserSchema })
  user!: AuthUserSchema;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps a data schema in the standard ApiResponse<T> Swagger envelope. */
export function apiRes(dataSchema: object) {
  return {
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: dataSchema,
        error: { type: 'string', nullable: true, example: null },
      },
    },
  };
}

/** Wraps an array data schema in the PaginatedResponse<T[]> Swagger envelope. */
export function apiPaginatedRes(itemSchema: object) {
  return {
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'array', items: itemSchema },
        error: { type: 'string', nullable: true, example: null },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
          },
        },
      },
    },
  };
}
