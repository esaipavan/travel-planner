-- Add 'super_admin' to the user_role_enum.
-- ALTER TYPE ... ADD VALUE cannot run inside a transaction block in PostgreSQL < 12.
-- Run this file alone in the SQL editor.

ALTER TYPE public.user_role_enum ADD VALUE IF NOT EXISTS 'super_admin';

-- Update is_admin() so SUPER_ADMIN also passes admin checks.
-- This preserves all existing RLS policies without any changes.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND user_role IN ('admin', 'super_admin')
  );
$$;

-- New helper for policies that require super_admin exclusively.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND user_role = 'super_admin'
  );
$$;
