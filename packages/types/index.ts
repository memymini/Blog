// ─── Primitives ───────────────────────────────────────────────────────────────

/** Supported UI / content languages. Extend here as new locales are added. */
export type Lang = 'ko' | 'en';

/** Media asset types embeddable in a post. */
export type MediaType = 'image' | 'video' | 'embed';

// ─── Database Row Types ───────────────────────────────────────────────────────
// These mirror the exact column names and types produced by Supabase.
// All fields are readonly — never mutate a row object; create a new one instead.

/**
 * Mirrors the `countries` table.
 * PK: code
 */
export interface Country {
  readonly code: string;      // ISO 3166-1 alpha-2 (e.g. "KR")
  readonly name_en: string;
  readonly flag_url: string;
}

/**
 * Mirrors the `posts` table.
 * PK: id
 * FK: country_code → countries.code
 */
export interface Post {
  readonly id: number;
  readonly country_code: string;
  readonly published: boolean;
  readonly cover_url: string | null;
  readonly created_at: string;   // ISO 8601 timestamptz
  readonly updated_at: string;
}

/**
 * Mirrors the `post_translations` table.
 * PK: (post_id, lang) — composite
 */
export interface PostTranslation {
  readonly post_id: number;
  readonly lang: Lang;
  readonly title: string;
  readonly excerpt: string | null;  // Short summary (~200 chars) for list views
  readonly contents: string;        // Full Markdown body
  readonly updated_at: string;
}

/**
 * Mirrors the `post_media` table.
 * PK: id
 */
export interface PostMedia {
  readonly id: number;
  readonly post_id: number;
  readonly type: MediaType;
  readonly url: string;
  readonly alt_text: string | null;
  readonly caption: string | null;
  readonly display_order: number;
}

// ─── Public View Types ────────────────────────────────────────────────────────

/**
 * Lean translation for list pages — title + excerpt only, no full contents.
 * Reduces bandwidth on paginated list endpoints.
 */
export interface PostListTranslation {
  readonly post_id: number;
  readonly lang: Lang;
  readonly title: string;
  readonly excerpt: string | null;
}

/**
 * Used by GET /posts — published list with one lean translation and country.
 * The `translation` field reflects the requested `lang` query param.
 */
export interface PostListItem extends Post {
  readonly translation: PostListTranslation;
  readonly country: Country;
}

/**
 * Used by GET /posts/:id?lang= — full post for SSG detail pages.
 * Includes one translation (matching the requested lang), country, and media.
 */
export interface PostDetail extends Post {
  readonly translation: PostTranslation;
  readonly country: Country;
  readonly media: PostMedia[];
}

// ─── Admin View Types ─────────────────────────────────────────────────────────

/**
 * Used by GET /admin/posts — all posts (including unpublished) for admin list.
 * Includes which languages have been authored, but not the full content.
 */
export interface AdminPostListItem extends Post {
  readonly country: Country;
  readonly available_langs: Lang[];
}

/**
 * Used by GET /admin/posts/:id — all translations + media for the edit screen.
 */
export interface AdminPostDetail extends Post {
  readonly country: Country;
  readonly translations: PostTranslation[];
  readonly media: PostMedia[];
}

// ─── API Response Envelope ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly meta: {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
  };
}

// ─── Request Payload Types ────────────────────────────────────────────────────

export interface CreatePostPayload {
  readonly country_code: string;
  readonly published?: boolean;
  readonly translations?: TranslationUpsertItem[];
}

export interface UpdatePostPayload {
  readonly country_code?: string;
  readonly published?: boolean;
  readonly cover_url?: string | null;
  readonly translations?: TranslationUpsertItem[];
}

/** Body for PUT /admin/posts/:id/translations/:lang — lang comes from the URL param. */
export interface UpsertTranslationPayload {
  readonly title: string;
  readonly contents: string;
}

/** Single translation item for inline upsert within POST/PATCH /admin/posts. */
export interface TranslationUpsertItem {
  readonly lang: Lang;
  readonly title: string;
  readonly contents: string;
}

export interface CreateMediaPayload {
  readonly type: MediaType;
  readonly url: string;
  readonly alt_text?: string;
  readonly caption?: string;
  readonly display_order?: number;
}

export interface ListPostsQuery {
  readonly lang: Lang;
  readonly country?: string;   // ISO 3166-1 alpha-2 filter
  readonly page?: number;
  readonly limit?: number;
}
