-- ============================================================
-- Migration 006: Supabase Storage bucket setup and policies
-- Run in Supabase Dashboard → SQL Editor AFTER creating buckets.
-- Buckets to create manually in Storage settings:
--   1. "avatars"   — public  bucket, max 5MB
--   2. "covers"    — public  bucket, max 10MB
--   3. "receipts"  — private bucket, max 10MB
--   4. "documents" — private bucket, max 20MB
--   5. "journal"   — private bucket, max 20MB
-- ============================================================

-- ── avatars (public) ─────────────────────────────────────────
CREATE POLICY "avatars: users upload own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: users update own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ── covers (public) ──────────────────────────────────────────
CREATE POLICY "covers: users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "covers: users update own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "covers: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- ── receipts (private) ───────────────────────────────────────
CREATE POLICY "receipts: users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "receipts: users read own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "receipts: users delete own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── documents (private) ──────────────────────────────────────
CREATE POLICY "documents: users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: users read own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: users delete own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── journal images (private) ─────────────────────────────────
CREATE POLICY "journal: users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'journal'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "journal: users read own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'journal'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "journal: users delete own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'journal'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
