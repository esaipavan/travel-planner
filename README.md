# TravelPlanner

A production-quality Travel Planning & Budgeting Web Application.

Plan trips · Track expenses · Build itineraries · Get AI recommendations · All for free.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, TypeScript (strict) |
| Styling | Tailwind CSS v3, shadcn/ui |
| State | TanStack Query v5, Zustand |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Auth + PostgreSQL + Storage + Edge Functions) |
| AI | Groq (primary) → Gemini → OpenRouter (fallback chain) |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- [Supabase](https://supabase.com) account (free)
- [Groq](https://console.groq.com) API key (free)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Fill in your Supabase URL and anon key in .env.local

# 4. Start development server
npm run dev
```

### Database Setup

Run the SQL migrations in order in Supabase Dashboard → SQL Editor:

1. `supabase/migrations/001_enums.sql`
2. `supabase/migrations/002_core_tables.sql`
3. `supabase/migrations/003_admin_tables.sql`
4. `supabase/migrations/005_functions.sql` ← must come before 004
5. `supabase/migrations/004_rls_policies.sql`
6. `supabase/migrations/006_storage_policies.sql` ← after creating buckets

### Storage Buckets

Create these in Supabase Dashboard → Storage:

| Bucket | Type | Max Size |
|--------|------|----------|
| `avatars` | Public | 5 MB |
| `covers` | Public | 10 MB |
| `receipts` | Private | 10 MB |
| `documents` | Private | 20 MB |
| `journal` | Private | 20 MB |

### AI Edge Function

```bash
# Deploy the AI chat function
supabase functions deploy ai-chat

# Set secrets
supabase secrets set AI_PROVIDER=groq
supabase secrets set GROQ_API_KEY=gsk_...
supabase secrets set GEMINI_API_KEY=AIza...      # optional fallback
supabase secrets set OPENROUTER_API_KEY=sk-or-... # optional fallback
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon key |
| `VITE_AI_PROVIDER` | ✅ | UI label: `groq`, `gemini`, or `openrouter` |
| `VITE_APP_NAME` | — | App display name (default: TravelPlanner) |

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type-check + build
npm run preview      # Preview production build
npm run lint         # Lint (0 warnings)
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript check only
```

---

## Project Structure

```
src/
├── app/             # App, Router, Providers
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # AppLayout, Sidebar, Header, MobileNav
│   └── shared/      # LoadingSpinner, EmptyState, ErrorBoundary
├── features/        # Feature modules (one per domain)
├── hooks/           # Shared custom hooks
├── lib/             # supabase, queryClient, utils
├── services/        # API service layers
├── store/           # Zustand stores
├── types/           # TypeScript types + DB types
└── utils/           # Constants, formatters, validators
```

---

## Build Status

Phase 0 — Project Foundation ✅

Upcoming: Phase 1 — Authentication + RBAC
