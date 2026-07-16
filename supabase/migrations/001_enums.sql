-- ============================================================
-- Migration 001: Custom enum types
-- Run this FIRST — tables in 002 depend on these types.
-- ============================================================

CREATE TYPE public.user_role_enum AS ENUM ('user', 'admin');

CREATE TYPE public.trip_status AS ENUM (
  'planning',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE public.expense_category AS ENUM (
  'hotel',
  'food',
  'transport',
  'shopping',
  'activity',
  'emergency',
  'fuel',
  'taxi',
  'misc'
);

CREATE TYPE public.itinerary_category AS ENUM (
  'transport',
  'accommodation',
  'activity',
  'food',
  'other'
);

CREATE TYPE public.item_status AS ENUM (
  'planned',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TYPE public.mood_enum AS ENUM (
  'amazing',
  'good',
  'okay',
  'bad',
  'terrible'
);

CREATE TYPE public.document_type AS ENUM (
  'passport',
  'visa',
  'ticket',
  'hotel',
  'insurance',
  'other'
);

CREATE TYPE public.payment_method AS ENUM (
  'cash',
  'card',
  'upi',
  'bank_transfer',
  'other'
);
