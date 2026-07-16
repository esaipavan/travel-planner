-- ============================================================
-- Migration 003: Admin module tables
-- Depends on: 002_core_tables.sql
-- ============================================================

-- User-submitted feedback
CREATE TABLE public.feedback (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  type        text        NOT NULL DEFAULT 'general'
                          CHECK (type IN ('general', 'feature_request', 'bug', 'complaint', 'compliment')),
  subject     text        NOT NULL,
  message     text        NOT NULL,
  status      text        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'in_review', 'resolved', 'closed')),
  admin_notes text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_status  ON public.feedback(status);

-- User-submitted bug reports
CREATE TABLE public.bug_reports (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  title                text        NOT NULL,
  description          text        NOT NULL,
  steps_to_reproduce   text,
  expected_behavior    text,
  actual_behavior      text,
  severity             text        NOT NULL DEFAULT 'medium'
                                   CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status               text        NOT NULL DEFAULT 'open'
                                   CHECK (status IN ('open', 'in_progress', 'resolved', 'wont_fix', 'duplicate')),
  browser_info         text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_bug_reports_user_id  ON public.bug_reports(user_id);
CREATE INDEX idx_bug_reports_severity ON public.bug_reports(severity);
CREATE INDEX idx_bug_reports_status   ON public.bug_reports(status);

-- Feature flags (admin-controlled)
CREATE TABLE public.feature_flags (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text        UNIQUE NOT NULL,
  description          text,
  is_enabled           boolean     NOT NULL DEFAULT false,
  rollout_percentage   smallint    NOT NULL DEFAULT 0
                                   CHECK (rollout_percentage BETWEEN 0 AND 100),
  created_by           uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- AI usage logs (written by Edge Function, read by admins)
CREATE TABLE public.ai_usage_logs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider          text        NOT NULL,
  model             text        NOT NULL,
  prompt_tokens     integer,
  completion_tokens integer,
  latency_ms        integer,
  success           boolean     NOT NULL DEFAULT true,
  error_message     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_usage_logs_user_id    ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_provider   ON public.ai_usage_logs(provider);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
