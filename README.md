# TravelPlanner

A production-grade, full-stack travel management platform built with React, TypeScript, Supabase, and Tailwind CSS.

Plan trips, track expenses, manage documents, and get AI-powered insights — all in a fast, offline-capable Progressive Web App.

## Live Demo

https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app

Sign in with Google or an email/password account. All data is fully isolated per user via Supabase Row Level Security.

## Tech Stack

- **Frontend:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Radix UI (shadcn/ui)
- **State:** TanStack Query v5, Zustand
- **Routing/Forms:** React Router v6, React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **PWA:** vite-plugin-pwa + Workbox
- **Hosting:** Vercel

## Features

- **Trip Management** — create trips with destination, dates, budget, and status
- **Itinerary Builder** — day-by-day planner with drag-and-drop reordering
- **Expense Tracking** — log expenses by category with budget vs. actual visualization
- **Document Management** — store travel documents with expiry tracking
- **Reminders** — reminders with card, list, and calendar views
- **Travel Journal** — trip diary with moods, ratings, and photos
- **Weather & Nearby Places** — 7-day forecasts and nearby POI search
- **Currency Converter** — real-time exchange rates
- **AI Assistant** — provider-agnostic AI chat via a Supabase Edge Function
- **Analytics** — KPIs, charts, and insights across all trips

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- A Supabase account (free tier is sufficient)
- Supabase CLI v2+

### Setup

```bash
# 1. Clone and install
git clone https://github.com/esaipavan/travel-planner.git
cd travel-planner
npm install

# 2. Apply database migrations
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# 3. Deploy the AI Edge Function and set secrets
supabase functions deploy ai-chat
supabase secrets set GROQ_API_KEY=gsk_...

# 4. Configure environment and start
cp .env.example .env.local   # add your Supabase URL and anon key
npm run dev                  # http://localhost:5173
```

Create Storage buckets in the Supabase Dashboard: `avatars`, `covers` (public); `receipts`, `documents`, `journal` (private).

## Environment Variables

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=TravelPlanner
VITE_AI_PROVIDER=groq
```

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required. AI provider API keys are stored only as Supabase Edge Function secrets and must never appear in `.env.local` or the frontend bundle.

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run type-check # TypeScript check
```

## License

Distributed under the MIT License. See `LICENSE` for details.

## Author

Sai Pavan Etikala
