-- ============================================================
-- Migration: 20260312000000_init_schema
-- Description: Create countries, posts, and post_translations
-- ============================================================

-- ── Helper: updated_at trigger function ─────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── 1. countries ─────────────────────────────────────────────
create table if not exists countries (
  code     text        not null,
  name_en  text        not null,
  flag_url text        not null,

  constraint countries_pkey primary key (code)
);

-- ── 2. posts ─────────────────────────────────────────────────
create table if not exists posts (
  id           bigint      generated always as identity,
  country_code text        not null,
  published    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint posts_pkey        primary key (id),
  constraint posts_country_fk  foreign key (country_code)
    references countries (code)
    on update cascade
    on delete restrict
);

create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_updated_at();

-- ── 3. post_translations ─────────────────────────────────────
create table if not exists post_translations (
  post_id  bigint not null,
  lang     text   not null,
  title    text   not null,
  contents text   not null,  -- Markdown

  constraint post_translations_pkey    primary key (post_id, lang),
  constraint post_translations_post_fk foreign key (post_id)
    references posts (id)
    on update cascade
    on delete cascade
);

-- ── Indexes ───────────────────────────────────────────────────
-- Speed up lookups by country on the posts list page
create index if not exists posts_country_code_idx
  on posts (country_code);

-- Speed up fetching all translations for a post
create index if not exists post_translations_post_id_idx
  on post_translations (post_id);

-- Speed up fetching all posts in a given language
create index if not exists post_translations_lang_idx
  on post_translations (lang);
