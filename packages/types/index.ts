// ─── Primitives ───────────────────────────────────────────────────────────────

/** Supported UI / content languages. Extend here as new locales are added. */
export type Lang = 'ko' | 'en';

// ─── Database Row Types ───────────────────────────────────────────────────────
// These mirror the exact column names and types produced by Supabase.
// All fields are readonly — never mutate a row object; create a new one instead.
// Note: Postgres `bigint` columns are returned as JS `number` by the Supabase JS client.

/**
 * Mirrors the `countries` table.
 * PK: code
 */
export interface Country {
  readonly code: string;      // PK — ISO 3166-1 alpha-2 (e.g. "KR")
  readonly name_en: string;
  readonly flag_url: string;
}

/**
 * Mirrors the `posts` table.
 * PK: id
 * FK: country_code → countries.code
 */
export interface Post {
  readonly id: number;           // PK — bigint in DB, number in JS
  readonly country_code: string; // FK → countries.code
  readonly published: boolean;
  readonly created_at: string;   // ISO 8601 timestamptz
  readonly updated_at: string;   // ISO 8601 timestamptz — auto-set by trigger
}

/**
 * Mirrors the `post_translations` table.
 * PK: (post_id, lang)  ← composite
 * FK: post_id → posts.id
 */
export interface PostTranslation {
  readonly post_id: number; // FK → posts.id, bigint in DB
  readonly lang: Lang;
  readonly title: string;
  readonly contents: string; // Markdown
}

// ─── Join / View Types ────────────────────────────────────────────────────────

/**
 * A single post joined with one language's translation and its country.
 * Used for SSG page rendering at /[lang]/posts/[id].
 */
export interface PostWithTranslation extends Post {
  readonly translation: PostTranslation;
  readonly country: Country;
}

// ─── API Request / Response Types ─────────────────────────────────────────────

/** Standard response envelope for all API endpoints. */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
}

/** Paginated list response, extends the standard envelope. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly meta: {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
  };
}

// ─── Admin Request Payload Types ──────────────────────────────────────────────

export interface CreatePostPayload {
  readonly country_code: string;
  readonly published?: boolean;
}

export interface UpsertTranslationPayload {
  readonly post_id: number;
  readonly lang: Lang;
  readonly title: string;
  readonly contents: string;
}
