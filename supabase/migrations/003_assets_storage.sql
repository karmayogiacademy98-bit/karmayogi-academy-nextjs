-- =====================================================
-- Migration 003: assets Storage bucket + RLS policies
-- =====================================================
-- Run this in your Supabase Dashboard > SQL Editor,
-- OR via: supabase db push (if using Supabase CLI)
-- =====================================================

-- 1. Create the assets bucket (public = files are publicly readable via URL)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  52428800,        -- 50 MB max file size
  null             -- allow all MIME types
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to read/download files (bucket is public)
CREATE POLICY "assets_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'assets');

-- 3. Allow authenticated users (admin) to upload
CREATE POLICY "assets_auth_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assets');

-- 4. Allow authenticated users to update
CREATE POLICY "assets_auth_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'assets');

-- 5. Allow authenticated users to delete
CREATE POLICY "assets_auth_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'assets');
