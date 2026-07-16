-- ============================================================
-- Migration 008: Grant table-level privileges to app roles
-- Depends on: 002_core_tables.sql, 003_admin_tables.sql
--
-- In PostgreSQL, RLS and GRANTs are independent layers:
--   GRANTs  → controls whether the role may attempt an operation
--   RLS     → controls which rows are visible / writable
-- "permission denied for table X" is always a missing GRANT,
-- never an RLS failure (RLS failures silently return 0 rows).
-- ============================================================

-- ── Schema access ────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ── Core user-owned tables ───────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips             TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_budgets      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_days    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_items   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packing_items     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.travel_documents  TO authenticated;

-- ── User-submitted support tables ────────────────────────────
-- UPDATE/DELETE intentionally excluded; admins handle those via service_role
GRANT SELECT, INSERT ON public.feedback    TO authenticated;
GRANT SELECT, INSERT ON public.bug_reports TO authenticated;

-- ── Read-only app tables ──────────────────────────────────────
GRANT SELECT ON public.feature_flags  TO authenticated;
GRANT SELECT ON public.ai_usage_logs  TO authenticated;

-- ── Sequences (required for INSERT on tables with serial/uuid defaults) ──
-- uuid columns use gen_random_uuid() so no sequences exist, but any
-- smallint/serial columns (day_number, order_index) rely on these.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ── Anonymous role: public read + unauthenticated submissions ─
GRANT SELECT ON public.trips           TO anon;
GRANT SELECT ON public.itinerary_days  TO anon;
GRANT SELECT ON public.itinerary_items TO anon;
GRANT SELECT ON public.journal_entries TO anon;
GRANT INSERT ON public.feedback        TO anon;
GRANT INSERT ON public.bug_reports     TO anon;

-- ── service_role: full access for Edge Functions (bypasses RLS) ─
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ── Default privileges: apply the same grants to any future tables ──
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;
