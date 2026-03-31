-- ============================================================
-- Migration: 20260328000000_add_excerpt_alt_text_updated_at
-- Description:
--   1. Add excerpt + updated_at to post_translations
--   2. Add alt_text to post_media
-- ============================================================

-- ── 1. post_translations ──────────────────────────────────────
alter table post_translations
  add column if not exists excerpt    text,
  add column if not exists updated_at timestamptz not null default now();

-- Auto-update updated_at on every row modification
create or replace function set_translation_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists post_translations_updated_at on post_translations;
create trigger post_translations_updated_at
  before update on post_translations
  for each row execute function set_translation_updated_at();

-- ── 2. post_media ─────────────────────────────────────────────
alter table post_media
  add column if not exists alt_text text;
