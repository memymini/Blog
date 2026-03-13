-- ============================================================
-- Migration: 20260313000001_rls_admin_cud
-- Description: Add CUD policies restricted to admin users.
--              "Admin" is identified by app_metadata.role = 'admin'
--              in the Supabase Auth JWT.
--
-- How to grant admin to your account:
--   Supabase Dashboard → Authentication → Users → [your user]
--   → Edit → app_metadata → { "role": "admin" }
--   (or via SQL: see bottom of this file)
-- ============================================================

-- ── Helper: reusable admin check ─────────────────────────────────────────────
-- (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
-- Checks the JWT claim set by the service role on the user's app_metadata.

-- ── countries ─────────────────────────────────────────────────────────────────
CREATE POLICY "countries_insert_admin"
  ON countries
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "countries_update_admin"
  ON countries
  FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "countries_delete_admin"
  ON countries
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── posts ─────────────────────────────────────────────────────────────────────
-- Admin can also SELECT unpublished posts (draft view).
CREATE POLICY "posts_select_admin"
  ON posts
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "posts_insert_admin"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "posts_update_admin"
  ON posts
  FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "posts_delete_admin"
  ON posts
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── post_translations ─────────────────────────────────────────────────────────
-- Admin can also SELECT translations of unpublished posts.
CREATE POLICY "post_translations_select_admin"
  ON post_translations
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "post_translations_insert_admin"
  ON post_translations
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "post_translations_update_admin"
  ON post_translations
  FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "post_translations_delete_admin"
  ON post_translations
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── Grant admin role to your user (run once, replace the email) ───────────────
-- UPDATE auth.users
-- SET    raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
-- WHERE  email = 'your@email.com';
