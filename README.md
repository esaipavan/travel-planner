<div align="center">

<br />

<img src="public/icon-512.svg" alt="TravelPlanner logo" width="96" height="96" />

<h1>TravelPlanner</h1>

<p>
  A production-grade, full-stack travel management platform.<br />
  Plan trips · track expenses · manage documents · get AI-powered insights.
</p>

<br />

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-0D9488?style=for-the-badge&logo=vercel&logoColor=white)](https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-64748B?style=for-the-badge)](LICENSE)

<br />

[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

[![Lighthouse Performance](https://img.shields.io/badge/Performance-98-0D9488?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev)
[![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-100-0D9488?style=flat-square)](https://pagespeed.web.dev)
[![Lighthouse Best Practices](https://img.shields.io/badge/Best%20Practices-100-0D9488?style=flat-square)](https://pagespeed.web.dev)
[![Lighthouse SEO](https://img.shields.io/badge/SEO-92-0D9488?style=flat-square)](https://pagespeed.web.dev)

<br /><br />

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [AI Capabilities](#ai-capabilities)
- [Authentication](#authentication)
- [Analytics](#analytics)
- [PWA Support](#pwa-support)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Security](#security)
- [Performance](#performance)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Author](#author)

---

## Overview

TravelPlanner is a **full-stack travel management platform** built for modern travelers. It consolidates every stage of a trip — from initial planning through on-the-road expense tracking to post-trip journal entries — into a single, fast, and offline-capable Progressive Web App.

The project demonstrates production-grade engineering practices throughout: strict TypeScript, Row Level Security enforced at the database layer, a Content Security Policy, code-split lazy routing, a server-side AI proxy with automatic provider fallback, and Lighthouse scores of 98/100/100/92.

**What makes this project stand out:**

| | |
|---|---|
| **No secrets in the client** | All AI provider API keys live exclusively in Supabase Edge Function secrets — zero exposure in client bundles or environment files |
| **RLS everywhere** | Every table enforces Row Level Security; users can only read and write their own data — even frontend bugs can't leak cross-user data |
| **Offline-first** | Workbox service worker pre-caches the full app shell; TanStack Query serves stale data while revalidating in the background |
| **Provider-agnostic AI** | A single Edge Function abstracts Groq, Gemini, and OpenRouter behind one interface with automatic fallback on failure |
| **Real performance** | Rollup manual chunking into 15+ named chunks, React.memo on expensive components, O(n) shared computation replacing triple O(n×m) scans in analytics |

---

## Live Demo

**[https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app](https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app)**

Sign in with Google or create an account using email and password. All data is fully isolated per user via Supabase Row Level Security.

---

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 — strict mode, `noUnusedLocals`, `noUnusedParameters` |
| Build | Vite 5 with Rollup manual chunking |
| Styling | Tailwind CSS 3 + Radix UI primitives (shadcn/ui) |
| Server state | TanStack Query v5 (`networkMode: 'offlineFirst'`) |
| Client state | Zustand |
| Routing | React Router v6, all pages `React.lazy()` |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Drag & Drop | @dnd-kit (itinerary reordering) |
| Dates | date-fns |
| Icons | Lucide React |
| Toasts | Sonner |
| PWA | vite-plugin-pwa + Workbox |

### Backend (Supabase)

| Service | Usage |
|---|---|
| PostgreSQL | Primary database — 15+ tables, custom enum types |
| Row Level Security | All tables — users access only their own data |
| Auth | Email/password + Google OAuth |
| Storage | Avatars, travel documents, journal photos |
| Edge Functions | AI chat proxy (Deno runtime) |

### External APIs

| API | Purpose |
|---|---|
| Open-Meteo | 7-day weather forecast (no API key required) |
| Nominatim / OpenStreetMap | Forward and reverse geocoding |
| Overpass API | Nearby places (restaurants, hotels, ATMs, hospitals) |
| CountriesNow | Country metadata and flag images |
| World Bank | Population and regional data |
| Wikipedia REST API | Destination summaries and thumbnails |
| Frankfurter | Real-time currency exchange rates |

### Infrastructure & Tooling

| Tool | Purpose |
|---|---|
| Vercel | Production hosting, SPA rewrites, security headers |
| Supabase CLI | Database migrations, Edge Function deployment |
| ESLint + Prettier | Code quality and formatting |
| rollup-plugin-visualizer | Bundle analysis |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                  │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Router  │  │ TanStack     │  │  Zustand        │   │
│  │ (lazy)   │  │ Query v5     │  │  (auth, theme)  │   │
│  └────┬─────┘  └──────┬───────┘  └────────┬────────┘   │
│       │               │                   │             │
│  ┌────▼───────────────▼───────────────────▼────────┐    │
│  │              Feature Slices                      │    │
│  │  auth · trips · expenses · journal · documents  │    │
│  │  reminders · analytics · assistant · weather    │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │  Supabase JS SDK               │
└───────────────────────┼─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────────┐
        │               │                   │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────────▼──────┐
│  Supabase    │ │  Supabase   │ │  Supabase      │
│  Auth        │ │  PostgreSQL │ │  Storage       │
│  (+ Google   │ │  + RLS      │ │  (avatars,     │
│   OAuth)     │ │             │ │   documents)   │
└──────────────┘ └─────────────┘ └────────────────┘
                        │
               ┌────────▼────────┐
               │  Edge Function  │
               │  ai-chat (Deno) │
               │                 │
               │  Groq  ──────►  │
               │  Gemini ──────► │  (automatic fallback)
               │  OpenRouter ──► │
               └─────────────────┘
```

### Design Principles

**Feature-Sliced Architecture** — each feature is self-contained with its own `pages/`, `components/`, `hooks/`, `services/`, and `types`. Cross-feature imports go through a public barrel. This eliminates hidden coupling and makes each feature independently navigable.

**Service layer abstraction** — application code never touches a provider SDK directly. All Supabase calls and AI calls go through typed service functions. Swapping or extending providers requires changes in one place only.

**Database as the security boundary** — RLS policies are enforced at the PostgreSQL layer, not the application layer. Frontend bugs cannot accidentally expose another user's data, because the database rejects the query before it returns a result.

**Zero secrets in the client** — all AI provider keys live in Edge Function secrets. The browser only ever calls `supabase.functions.invoke('ai-chat')`. The Edge Function owns provider selection, API calls, and fallback logic entirely.

---

## Features

### Trip Management

- Create and manage trips with destination, date range, budget, and status (Planning → Active → Completed → Cancelled)
- Detailed trip view with tabbed navigation: Itinerary, Expenses, Budget, and Checklist
- Real-time search and multi-filter by status and destination

### Itinerary Builder

- Day-by-day itinerary with drag-and-drop item reordering (@dnd-kit)
- Item categories: Transport, Accommodation, Activity, Food, Other
- Status tracking per item (Planned → Confirmed → Completed)
- Time and notes fields per item

### Expense Tracking

- Log expenses with category, amount, currency, and payment method (Cash, Card, UPI, Bank Transfer)
- 9 categories: Hotel, Food, Transport, Shopping, Activity, Emergency, Fuel, Taxi, Misc
- Budget vs. actual spending visualization with over-budget alerts
- Full filter and sort controls

### Budget Management

- Set total budget per trip
- Real-time budget utilisation percentage across the dashboard and analytics
- Over-budget trips highlighted visually

### Packing Checklist

- Reusable checklist per trip with category grouping
- Bulk check/uncheck and progress indicator

### Document Management

- Upload passports, visas, flight tickets, hotel bookings, insurance certificates, and more
- Expiry tracking with color-coded status: Valid, Expiring Soon (within 30 days), Expired
- Secure file storage in Supabase Storage with per-user RLS policies

### Reminders

- Create reminders with type (passport, visa, flight, hotel, packing, payment, insurance, vaccination, check-in, custom), priority (High/Medium/Low), and repeat (None/Daily/Weekly/Monthly/Yearly)
- Snooze and mark-complete actions
- Three views: Card, List, Calendar
- Effective status: Pending, Overdue, Completed

### Travel Journal

- Trip diary entries with mood selection, star ratings (1–5), and optional photo upload
- Photos stored securely in Supabase Storage
- Filter by trip, mood, and rating

### Weather

- 7-day forecast for any city via Open-Meteo
- Geolocation detection with fallback to manual city search
- Temperature, wind speed, humidity, and precipitation

### Nearby Places

- Find restaurants, hotels, cafes, ATMs, hospitals, fuel stations, and tourist attractions within 3 km
- Powered by OpenStreetMap's Overpass API (no API key required)
- One-click "Open in Google Maps" per result

### Currency Converter

- Real-time exchange rates via Frankfurter
- Support for 30+ currencies with instant calculation
- Swap currencies with a single click

### Destination Intelligence

- Country profile (flag, capital, region, population, currency, languages, calling code) via CountriesNow and World Bank
- Wikipedia article summary and thumbnail for any destination
- Tourism-focused secondary article loaded alongside the main country page

### User Profile

- Edit display name and upload or remove profile avatar
- Avatar stored in Supabase Storage with RLS
- Profile statistics: trips, countries, total expenses, journal entries

### Admin Panel (role-gated)

- User management with role assignment
- Feature flag management
- AI usage logs
- Feedback and bug report review
- Platform health and API status checks

---

## AI Capabilities

The AI assistant (`/assistant`) is powered by a **Supabase Edge Function** that acts as a provider-agnostic proxy. The browser only ever calls `supabase.functions.invoke('ai-chat')` — it never communicates with an AI provider directly.

```
Browser → Supabase Edge Function → [Groq → Gemini → OpenRouter]
                                         (automatic fallback)
```

**Key design decisions:**

- **Provider isolation** — switching or adding AI providers requires changes inside the Edge Function only; no frontend code changes needed
- **Automatic fallback** — if the primary provider (Groq) fails or rate-limits, the function falls back to Gemini, then OpenRouter
- **JWT verification** — every request to the Edge Function is verified against the Supabase JWT before any AI call is made
- **No key exposure** — `GROQ_API_KEY`, `GEMINI_API_KEY`, and `OPENROUTER_API_KEY` are stored exclusively in Supabase Edge Function secrets

**What users can ask:**
Multi-turn travel planning conversations, itinerary suggestions, visa and entry requirement information, packing advice by destination and season, local customs and safety tips, and budget estimates.

---

## Authentication

Authentication is handled entirely by Supabase Auth.

| Method | Flow |
|---|---|
| Email / password | Native Supabase Auth with email verification |
| Google OAuth | OAuth 2.0 via Supabase — redirect-based PKCE flow |
| Password reset | Email link → `/reset-password` |

**Session management:**

1. Supabase issues a JWT on sign-in, stored in `localStorage`
2. The Supabase JS client automatically refreshes the token before expiry
3. A Zustand `useAuthStore` distributes `user`, `session`, `role`, `isAdmin`, `isSuperAdmin`, `isLoading` app-wide
4. Route guards (`RequireAuth`, `RequireAdmin`, `RequireSuperAdmin`, `RequireGuest`) enforce access at the router level
5. All authenticated routes are `React.lazy()` — unauthenticated users never download their JavaScript

**OAuth redirect URL:**
`signInWithGoogle()` uses `window.location.origin` to construct `redirectTo` dynamically — no environment variable needed, correct in development, preview, and production automatically.

**Required Supabase Dashboard settings:**

```
Authentication → URL Configuration
  Site URL:      https://your-app.vercel.app
  Redirect URLs: https://your-app.vercel.app/auth/callback
                 http://localhost:5173/auth/callback
                 http://localhost:4173/auth/callback
```

---

## Analytics

The Analytics page aggregates data across all trips and features into a comprehensive travel report.

**8 KPI Cards:**
Total Trips · Upcoming Trips · Completed Trips · Countries Visited · Total Budget · Total Expenses · Budget Remaining · Average Trip Cost

**6 Charts:**

| Chart | Type | Description |
|---|---|---|
| Monthly Expenses | AreaChart | Spending trend over the last 12 months |
| Expense by Category | PieChart | Breakdown across 9 expense categories |
| Budget vs Actual | BarChart | Side-by-side comparison for top 6 trips |
| Trips per Month | BarChart | Trip frequency over the last 12 months |
| Journal Ratings | BarChart | Average star rating per destination |
| Reminder Status | PieChart | Pending / Completed / Overdue split |

**Insights panel:**
Highest and lowest spending trips, most visited destination, average trip duration, average journal rating, documents expiring within 30 days, pending reminder count, and budget utilisation percentage.

**Performance optimization:**
A shared `Map<tripId, totalAmount>` is built in a single O(n) pass and reused across all downstream `useMemo` blocks — eliminating the triple O(n×m) nested-loop scans that previously ran independently in each chart's hook.

---

## PWA Support

TravelPlanner is a fully-featured Progressive Web App built with `vite-plugin-pwa` and Workbox.

| Feature | Implementation |
|---|---|
| Installable | Web App Manifest with 192×192 and 512×512 SVG icons |
| Offline shell | Workbox `generateSW` pre-caches all build assets at deploy time |
| Offline API data | TanStack Query `networkMode: 'offlineFirst'` serves cached data when offline |
| Runtime caching | Supabase REST: NetworkFirst (5s timeout); Supabase Storage: CacheFirst (7 days) |
| Auto-update | `registerType: 'autoUpdate'` — new service workers install silently |
| Install prompt | Custom `InstallButton` component in the header |
| Network indicator | `SyncIndicator` shows online / offline / revalidating state |

---

## Screenshots

> Replace placeholders with actual screenshots after capturing from the live deployment.

| Login | Dashboard | Trip Detail |
|:---:|:---:|:---:|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Trip Detail](docs/screenshots/trip-detail.png) |

| Analytics | Reminders | AI Assistant |
|:---:|:---:|:---:|
| ![Analytics](docs/screenshots/analytics.png) | ![Reminders](docs/screenshots/reminders.png) | ![AI Assistant](docs/screenshots/assistant.png) |

| Documents | Journal | Nearby Places |
|:---:|:---:|:---:|
| ![Documents](docs/screenshots/documents.png) | ![Journal](docs/screenshots/journal.png) | ![Nearby](docs/screenshots/nearby.png) |

---

## Project Structure

```
travel-planner/
├── public/
│   ├── icon-192.svg
│   └── icon-512.svg
├── src/
│   ├── app/
│   │   └── Router.tsx              # All 30+ routes, lazy-loaded, with auth guards
│   ├── components/
│   │   ├── layout/                 # Header, Sidebar, AppLayout, MobileNav
│   │   ├── providers/              # AuthInitializer, QueryProvider
│   │   ├── shared/                 # PageHeader, EmptyState, ErrorBoundary
│   │   ├── ui/                     # shadcn/ui primitives (Button, Dialog, etc.)
│   │   └── pwa/                    # InstallButton, SyncIndicator
│   ├── features/                   # Feature-Sliced modules
│   │   ├── admin/                  # User management, feature flags, bug reports
│   │   ├── analytics/              # KPI cards, 6 charts, insights panel
│   │   ├── assistant/              # AI chat interface + quick prompts
│   │   ├── auth/                   # Login, Register, OAuth callback, Reset
│   │   ├── budget/                 # Trip budget management
│   │   ├── checklist/              # Packing checklist
│   │   ├── currency/               # Currency converter
│   │   ├── dashboard/              # Overview widgets
│   │   ├── destination/            # Country info + Wikipedia summaries
│   │   ├── documents/              # Travel document storage + expiry tracking
│   │   ├── expenses/               # Expense logging and history
│   │   ├── itinerary/              # Drag-and-drop day planner
│   │   ├── journal/                # Trip diary with photos
│   │   ├── nearby/                 # Overpass-powered place search + map
│   │   ├── profile/                # User profile + avatar upload
│   │   ├── reminders/              # Reminders with calendar view
│   │   ├── trips/                  # Trip CRUD and detail
│   │   └── weather/                # Open-Meteo forecast
│   ├── hooks/                      # Shared hooks (useNetworkStatus, useInstallPrompt)
│   ├── lib/
│   │   └── supabase.ts             # Typed Supabase client singleton
│   ├── store/
│   │   ├── auth.store.ts           # Zustand auth store
│   │   └── theme.store.ts          # Zustand theme store
│   ├── types/
│   │   └── database.types.ts       # Auto-generated Supabase types
│   └── utils/
│       ├── constants.ts
│       └── formatters.ts
├── supabase/
│   ├── functions/
│   │   └── ai-chat/                # Edge Function — AI provider proxy (Deno)
│   │       ├── index.ts
│   │       └── providers/          # groq.ts, gemini.ts, openrouter.ts
│   └── migrations/
│       ├── 001_enums.sql
│       ├── 002_core_tables.sql
│       ├── 003_admin_tables.sql
│       ├── 004_rls_policies.sql
│       ├── 005_functions.sql
│       ├── 006_storage_policies.sql
│       ├── 007_add_super_admin_role.sql
│       ├── 008_grant_privileges.sql
│       └── 009_reminders.sql
├── vercel.json                     # SPA rewrites + Content Security Policy + headers
├── vite.config.ts                  # Vite + PWA + Rollup chunk splitting
└── tailwind.config.js
```

Every feature module follows the same internal structure:

```
features/[feature]/
├── components/   # Feature-specific UI components
├── hooks/        # TanStack Query data-fetching and mutation hooks
├── pages/        # Route-level page components
└── services/     # All Supabase and external API calls for this feature
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (free tier sufficient)
- [Supabase CLI](https://supabase.com/docs/guides/cli) v2+

### 1 — Clone and install

```bash
git clone https://github.com/esaipavan/travel-planner.git
cd travel-planner
npm install
```

### 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish provisioning (~2 minutes)

### 3 — Apply database migrations

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

This runs all 9 migrations in order, creating every table, custom enum type, constraint, index, RLS policy, and grant.

### 4 — Create Storage buckets

In Supabase Dashboard → Storage, create:

| Bucket | Type | Max size |
|---|---|---|
| `avatars` | Public | 5 MB |
| `covers` | Public | 10 MB |
| `receipts` | Private | 10 MB |
| `documents` | Private | 20 MB |
| `journal` | Private | 20 MB |

### 5 — Deploy the AI Edge Function

```bash
supabase functions deploy ai-chat

# Set AI provider secrets (at least one required)
supabase secrets set GROQ_API_KEY=gsk_...
supabase secrets set GEMINI_API_KEY=AIza...         # fallback
supabase secrets set OPENROUTER_API_KEY=sk-or-...   # fallback
supabase secrets set AI_PROVIDER=groq
```

### 6 — Configure Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Click **Create credentials → OAuth 2.0 Client ID**, set application type to **Web application**
3. Add this authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → Authentication → Providers → Google, enter the Client ID and Secret

### 7 — Set environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key
```

### 8 — Start the dev server

```bash
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

Create `.env.local` in the project root. Only two variables are required.

```env
# ── Supabase ──────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ── App Config ────────────────────────────────────────────────────────────────
VITE_APP_NAME=TravelPlanner

# ── AI Provider (frontend label only — no API key here) ───────────────────────
VITE_AI_PROVIDER=groq
```

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous (public) key |
| `VITE_APP_NAME` | — | Display name (default: TravelPlanner) |
| `VITE_AI_PROVIDER` | — | UI label only — `groq`, `gemini`, or `openrouter` |

> **Security note:** `GROQ_API_KEY`, `GEMINI_API_KEY`, and `OPENROUTER_API_KEY` are **Supabase Edge Function secrets only**. They must never appear in `.env.local`, in the frontend bundle, or in any browser-accessible context.

---

## Local Development

```bash
npm run dev          # Start dev server with HMR
npm run type-check   # TypeScript strict check (no emit)
npm run lint         # ESLint (0 warnings policy)
npm run lint:fix     # Auto-fix lint issues
npm run format       # Prettier formatting
npm run build        # Production build
npm run preview      # Preview production build locally
npm run analyze      # Bundle analysis → dist/stats.html
```

---

## Production Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/esaipavan/travel-planner)

**Set these in Vercel Dashboard → Settings → Environment Variables:**

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | From Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | From Supabase Dashboard → Settings → API |
| `VITE_AI_PROVIDER` | `groq` (or `gemini` / `openrouter`) |

**Update Supabase Auth URLs for production** (Dashboard → Authentication → URL Configuration):

```
Site URL:      https://your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/auth/callback
               http://localhost:5173/auth/callback
               http://localhost:4173/auth/callback
```

The `vercel.json` in this repository configures SPA rewrites and all security headers automatically.

---

## Security

### Content Security Policy

A strict CSP is enforced via `vercel.json`, allowlisting only the exact origins the application contacts:

```
default-src 'self'
script-src 'self'                              — no external scripts
style-src 'self' 'unsafe-inline'               — required for Sonner toast animations
connect-src 'self'
  https://*.supabase.co  wss://*.supabase.co   — Supabase REST + Realtime
  https://api.open-meteo.com                   — weather
  https://nominatim.openstreetmap.org          — geocoding
  https://overpass-api.de                      — nearby places
  https://countriesnow.space                   — country data
  https://api.worldbank.org                    — population data
  https://en.wikipedia.org                     — destination summaries
  https://api.frankfurter.dev                  — exchange rates
img-src 'self' data: blob:
  https://*.supabase.co                        — user uploads
  https://*.googleusercontent.com             — Google avatars
  https://flagcdn.com                          — country flags
  https://upload.wikimedia.org                 — Wikipedia images
object-src 'none'                              — no plugins
frame-ancestors 'none'                         — clickjacking prevention
```

AI provider hostnames (Groq, Gemini, OpenRouter) are **intentionally absent** from `connect-src` — they are called server-side only from the Edge Function, never from the browser.

### Database Security

- Row Level Security enabled on every table
- All policies enforce `user_id = auth.uid()` — users can only access their own rows
- `service_role` (Edge Functions) bypasses RLS for admin-scoped operations only

### Additional Measures

| Measure | Detail |
|---|---|
| No source maps in production | `sourcemap: false` in `vite.config.ts` — minified bundles expose no source |
| Zero secrets in client bundle | AI API keys live exclusively in Supabase Edge Function secrets |
| JWT verification on Edge Function | Every AI chat request is verified before any provider call |
| `X-Frame-Options: DENY` | Clickjacking prevention |
| `X-Content-Type-Options: nosniff` | MIME sniffing prevention |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | Camera and microphone disabled; geolocation self-only |

---

## Performance

### Lighthouse (production)

| Metric | Score |
|---|---|
| Performance | **98** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **92** |

### Bundle Strategy

Rollup `manualChunks` splits the production build into 15+ named chunks with stable content hashes:

| Chunk | Contents | Load strategy |
|---|---|---|
| `vendor` | React, React DOM, React Router | Eager — critical path |
| `supabase` | @supabase/supabase-js | Eager |
| `query` | @tanstack/react-query | Eager |
| `icons` | lucide-react | Eager — used on every page |
| `ui` | All @radix-ui primitives + Sonner | Eager |
| `charts` | recharts + recharts dependencies | `modulepreload` — pre-fetched, parsed on demand |
| `maps` | leaflet + react-leaflet | Lazy — loaded only on the Nearby page |
| `validation` | zod + @hookform/resolvers | Lazy |
| `date-fns` | date-fns | Lazy |

### React Rendering

- `React.memo` on `KPICards`, `InsightsPanel`, `InsightCard`, and `QuickActions`
- Shared `expensesByTripId: Map<string, number>` built in one O(n) pass and consumed via O(1) lookups in three downstream `useMemo` blocks — eliminates triple O(n×m) scans that previously ran independently per chart
- All 30+ routes are `React.lazy()` — zero authenticated page code downloaded by unauthenticated users
- TanStack Query deduplicates in-flight requests and serves stale data instantly

### Caching

- TanStack Query `staleTime`: 2–5 minutes depending on data volatility
- Workbox pre-caches all 85+ static assets on install
- Supabase REST: NetworkFirst (5s timeout, then cache)
- Supabase Storage: CacheFirst (7-day TTL)

---

## Future Enhancements

- [ ] **Collaborative trips** — invite travel companions with role-based editing and shared expense splitting
- [ ] **Push notifications** — Web Push API alerts for upcoming trip dates and expiring documents
- [ ] **AI itinerary generation** — one-click full day-by-day itinerary from destination, duration, and interests
- [ ] **PDF export** — printable trip summary with itinerary, expenses, and document checklist
- [ ] **Offline mutations** — queue creates and updates while offline; sync automatically on reconnect
- [ ] **Multi-currency budgets** — set per-trip budget in local currency with automatic conversion to home currency
- [ ] **Expense OCR** — scan receipt photos and auto-extract amount, merchant, and category
- [ ] **Dark map tiles** — theme-aware Leaflet tiles matching the app's dark mode
- [ ] **Travel statistics** — lifetime totals: distance, nights away, countries visited, average rating
- [ ] **E2E test suite** — Playwright coverage for all critical user flows

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## Author

**Sai Pavan Etikala**

[![Email](https://img.shields.io/badge/Email-saipavanetikala5%40gmail.com-0D9488?style=flat-square&logo=gmail&logoColor=white)](mailto:saipavanetikala5@gmail.com)

---

<div align="center">

Built with React, TypeScript, and Supabase · Deployed on Vercel

</div>
