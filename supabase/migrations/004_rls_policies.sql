-- ============================================================
-- Migration 004: Row Level Security policies
-- Depends on: 002, 003, 005 (is_admin function must exist first)
-- NOTE: Run 005_functions.sql BEFORE this file.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_budgets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs    ENABLE ROW LEVEL SECURITY;

-- ── profiles ────────────────────────────────────────────────
CREATE POLICY "profiles: users read own, admins read all"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── trips ────────────────────────────────────────────────────
CREATE POLICY "trips: owner full access"
  ON public.trips FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "trips: public read shared trips"
  ON public.trips FOR SELECT
  USING (is_public = true);

CREATE POLICY "trips: admin read all"
  ON public.trips FOR SELECT
  USING (public.is_admin());

-- ── trip_budgets ─────────────────────────────────────────────
CREATE POLICY "trip_budgets: owner of trip"
  ON public.trip_budgets FOR ALL
  USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()))
  WITH CHECK (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));

-- ── expenses ─────────────────────────────────────────────────
CREATE POLICY "expenses: owner full access"
  ON public.expenses FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "expenses: admin read all"
  ON public.expenses FOR SELECT
  USING (public.is_admin());

-- ── itinerary_days ───────────────────────────────────────────
CREATE POLICY "itinerary_days: owner of trip"
  ON public.itinerary_days FOR ALL
  USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()))
  WITH CHECK (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));

CREATE POLICY "itinerary_days: public shared trips"
  ON public.itinerary_days FOR SELECT
  USING (trip_id IN (SELECT id FROM public.trips WHERE is_public = true));

-- ── itinerary_items ──────────────────────────────────────────
CREATE POLICY "itinerary_items: via day ownership"
  ON public.itinerary_items FOR ALL
  USING (
    day_id IN (
      SELECT d.id FROM public.itinerary_days d
      JOIN public.trips t ON t.id = d.trip_id
      WHERE t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    day_id IN (
      SELECT d.id FROM public.itinerary_days d
      JOIN public.trips t ON t.id = d.trip_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "itinerary_items: public shared trips"
  ON public.itinerary_items FOR SELECT
  USING (
    day_id IN (
      SELECT d.id FROM public.itinerary_days d
      JOIN public.trips t ON t.id = d.trip_id
      WHERE t.is_public = true
    )
  );

-- ── packing_items ────────────────────────────────────────────
CREATE POLICY "packing_items: owner of trip"
  ON public.packing_items FOR ALL
  USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()))
  WITH CHECK (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));

-- ── journal_entries ──────────────────────────────────────────
CREATE POLICY "journal_entries: owner full access"
  ON public.journal_entries FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "journal_entries: public shared entries"
  ON public.journal_entries FOR SELECT
  USING (is_public = true);

-- ── travel_documents ─────────────────────────────────────────
CREATE POLICY "travel_documents: owner only"
  ON public.travel_documents FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── feedback ─────────────────────────────────────────────────
CREATE POLICY "feedback: users insert own"
  ON public.feedback FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "feedback: users read own"
  ON public.feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "feedback: admins read all"
  ON public.feedback FOR SELECT
  USING (public.is_admin());

CREATE POLICY "feedback: admins update (status/notes)"
  ON public.feedback FOR UPDATE
  USING (public.is_admin());

-- ── bug_reports ──────────────────────────────────────────────
CREATE POLICY "bug_reports: users insert"
  ON public.bug_reports FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "bug_reports: users read own"
  ON public.bug_reports FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "bug_reports: admins read all"
  ON public.bug_reports FOR SELECT
  USING (public.is_admin());

CREATE POLICY "bug_reports: admins update"
  ON public.bug_reports FOR UPDATE
  USING (public.is_admin());

-- ── feature_flags ─────────────────────────────────────────────
CREATE POLICY "feature_flags: everyone reads enabled flags"
  ON public.feature_flags FOR SELECT
  USING (is_enabled = true OR public.is_admin());

CREATE POLICY "feature_flags: admins full access"
  ON public.feature_flags FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── ai_usage_logs ─────────────────────────────────────────────
-- INSERT comes from Edge Function using service_role key (bypasses RLS)
CREATE POLICY "ai_usage_logs: admins read all"
  ON public.ai_usage_logs FOR SELECT
  USING (public.is_admin());
