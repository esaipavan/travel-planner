-- ============================================================
-- Migration 009: Reminders table
-- Depends on: 001_enums.sql, 002_core_tables.sql (trips),
--             008_grant_privileges.sql
--
-- Schema sourced directly from live DB via:
--   supabase db query --linked
-- ============================================================

-- ── Enum types ────────────────────────────────────────────────

CREATE TYPE public.reminder_type AS ENUM (
  'passport',
  'visa',
  'flight',
  'hotel',
  'packing',
  'payment',
  'insurance',
  'vaccination',
  'check_in',
  'custom'
);

CREATE TYPE public.reminder_priority AS ENUM (
  'low',
  'medium',
  'high'
);

CREATE TYPE public.reminder_status AS ENUM (
  'pending',
  'completed'
);

CREATE TYPE public.reminder_repeat AS ENUM (
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly'
);

-- ── Table ─────────────────────────────────────────────────────

CREATE TABLE public.reminders (
  id             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  user_id        uuid                     NOT NULL,
  trip_id        uuid,
  title          text                     NOT NULL,
  description    text,
  type           public.reminder_type     NOT NULL DEFAULT 'custom'::public.reminder_type,
  reminder_date  date                     NOT NULL,
  reminder_time  time without time zone,
  priority       public.reminder_priority NOT NULL DEFAULT 'medium'::public.reminder_priority,
  status         public.reminder_status   NOT NULL DEFAULT 'pending'::public.reminder_status,
  repeat         public.reminder_repeat   NOT NULL DEFAULT 'none'::public.reminder_repeat,
  is_snoozed     boolean                  NOT NULL DEFAULT false,
  snoozed_until  timestamptz,
  completed_at   timestamptz,
  created_at     timestamptz              NOT NULL DEFAULT now(),
  updated_at     timestamptz              NOT NULL DEFAULT now(),

  CONSTRAINT reminders_pkey PRIMARY KEY (id),
  CONSTRAINT reminders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT reminders_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips (id) ON DELETE SET NULL
);

-- ── Indexes ───────────────────────────────────────────────────

CREATE INDEX reminders_user_id_idx     ON public.reminders USING btree (user_id);
CREATE INDEX reminders_trip_id_idx     ON public.reminders USING btree (trip_id);
CREATE INDEX reminders_status_idx      ON public.reminders USING btree (status);
CREATE INDEX reminders_reminder_date_idx ON public.reminders USING btree (reminder_date);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY reminders_select ON public.reminders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY reminders_insert ON public.reminders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY reminders_update ON public.reminders
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY reminders_delete ON public.reminders
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ── Grants ────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL                            ON public.reminders TO service_role;
