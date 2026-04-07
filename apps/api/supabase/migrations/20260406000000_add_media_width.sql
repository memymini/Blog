-- Migration: 20260406000000_add_media_width
-- Description: Add width column to post_media for per-item display size control

ALTER TABLE post_media
  ADD COLUMN IF NOT EXISTS width integer DEFAULT 100
  CHECK (width BETWEEN 10 AND 100);
