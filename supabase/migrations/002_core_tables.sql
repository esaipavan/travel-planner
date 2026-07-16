-- ============================================================
-- Migration 002: Core application tables
-- Depends on: 001_enums.sql
-- ============================================================

-- profiles: one row per user, auto-created by trigger (005)
CREATE TABLE public.profiles (
  id                    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name             text,
  avatar_url            text,
  home_currency         char(3)              NOT NULL DEFAULT 'INR',
  preferred_language    char(2)              NOT NULL DEFAULT 'en',
  dark_mode             boolean              NOT NULL DEFAULT false,
  user_role             public.user_role_enum NOT NULL DEFAULT 'user',
  notifications_enabled boolean              NOT NULL DEFAULT true,
  created_at            timestamptz          NOT NULL DEFAULT now(),
  updated_at            timestamptz          NOT NULL DEFAULT now()
);

-- trips
CREATE TABLE public.trips (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           text         NOT NULL,
  destination     text         NOT NULL,
  country_code    char(2),
  cover_image_url text,
  latitude        float8,
  longitude       float8,
  start_date      date         NOT NULL,
  end_date        date         NOT NULL,
  status          public.trip_status NOT NULL DEFAULT 'planning',
  total_budget    numeric(12,2),
  currency        char(3)      NOT NULL DEFAULT 'INR',
  notes           text,
  is_public       boolean      NOT NULL DEFAULT false,
  is_favourite    boolean      NOT NULL DEFAULT false,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT trips_dates_check CHECK (end_date >= start_date)
);
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status  ON public.trips(status);

-- trip_budgets: allocated budget per category per trip
CREATE TABLE public.trip_budgets (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id          uuid        NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category         public.expense_category NOT NULL,
  allocated_amount numeric(12,2) NOT NULL DEFAULT 0,
  currency         char(3)     NOT NULL DEFAULT 'INR',
  UNIQUE(trip_id, category)
);

-- expenses
CREATE TABLE public.expenses (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id        uuid        NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id        uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category       public.expense_category NOT NULL,
  title          text        NOT NULL,
  amount         numeric(12,2) NOT NULL,
  currency       char(3)     NOT NULL DEFAULT 'INR',
  date           date        NOT NULL,
  notes          text,
  receipt_url    text,
  payment_method public.payment_method,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);

-- itinerary_days
CREATE TABLE public.itinerary_days (
  id         uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    uuid     NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number smallint NOT NULL,
  date       date     NOT NULL,
  title      text,
  notes      text,
  UNIQUE(trip_id, day_number)
);
CREATE INDEX idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);

-- itinerary_items
CREATE TABLE public.itinerary_items (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id         uuid        NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  title          text        NOT NULL,
  description    text,
  start_time     time,
  end_time       time,
  location_name  text,
  latitude       float8,
  longitude      float8,
  category       public.itinerary_category NOT NULL DEFAULT 'other',
  estimated_cost numeric(12,2),
  status         public.item_status NOT NULL DEFAULT 'planned',
  order_index    smallint    NOT NULL DEFAULT 0
);
CREATE INDEX idx_itinerary_items_day_id ON public.itinerary_items(day_id);

-- packing_items
CREATE TABLE public.packing_items (
  id          uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     uuid     NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name        text     NOT NULL,
  category    text,
  quantity    smallint NOT NULL DEFAULT 1,
  is_packed   boolean  NOT NULL DEFAULT false,
  is_essential boolean NOT NULL DEFAULT false,
  order_index smallint NOT NULL DEFAULT 0
);
CREATE INDEX idx_packing_items_trip_id ON public.packing_items(trip_id);

-- journal_entries
CREATE TABLE public.journal_entries (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id       uuid        NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         text,
  content       text,
  date          date        NOT NULL,
  mood          public.mood_enum,
  image_urls    text[],
  location_name text,
  is_public     boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_journal_entries_trip_id ON public.journal_entries(trip_id);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);

-- travel_documents
CREATE TABLE public.travel_documents (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id     uuid        REFERENCES public.trips(id) ON DELETE SET NULL,
  type        public.document_type NOT NULL,
  name        text        NOT NULL,
  file_url    text        NOT NULL,
  file_size   integer,
  expiry_date date,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_travel_documents_user_id ON public.travel_documents(user_id);
