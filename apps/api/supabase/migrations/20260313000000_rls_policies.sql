-- ============================================================
-- Migration: 20260313000000_rls_policies
-- Description: Enable RLS and add read policies for public access.
--              Admin writes are handled by the NestJS API using
--              SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely.
-- ============================================================

-- ── Enable RLS on all tables ──────────────────────────────────────────────────
ALTER TABLE countries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;

-- ── countries ─────────────────────────────────────────────────────────────────
-- Anyone can read countries (no sensitive data).
CREATE POLICY "countries_select_public"
  ON countries
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── posts ─────────────────────────────────────────────────────────────────────
-- Only published posts are visible to the public.
CREATE POLICY "posts_select_published"
  ON posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- ── post_translations ─────────────────────────────────────────────────────────
-- Translations are only visible when their parent post is published.
CREATE POLICY "post_translations_select_published"
  ON post_translations
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM   posts
      WHERE  posts.id        = post_translations.post_id
        AND  posts.published = true
    )
  );
