-- ============================================================
-- Migration: 20260326000000_add_cover_url_and_media
-- Description: Add cover_url to posts; create post_media table
-- ============================================================

-- ── 1. Add cover_url to posts ─────────────────────────────────
alter table posts
  add column if not exists cover_url text;

-- ── 2. post_media ─────────────────────────────────────────────
create table if not exists post_media (
  id            bigint      generated always as identity,
  post_id       bigint      not null,
  type          text        not null,
  url           text        not null,
  caption       text,
  display_order int         not null default 0,

  constraint post_media_pkey    primary key (id),
  constraint post_media_type_ck check (type in ('image', 'video', 'embed')),
  constraint post_media_post_fk foreign key (post_id)
    references posts (id)
    on update cascade
    on delete cascade
);

create index if not exists post_media_post_id_idx
  on post_media (post_id, display_order);

-- ── 3. RLS ────────────────────────────────────────────────────
alter table post_media enable row level security;

-- Public read (published posts only)
create policy "public read post_media"
  on post_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from posts
      where posts.id = post_media.post_id
        and posts.published = true
    )
  );

-- Admin full access
create policy "admin all post_media"
  on post_media for all
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
