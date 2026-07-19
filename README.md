<div align="center">

<img src="public/icon-512.svg" alt="TravelPlanner logo" width="110" height="110" />

# ✈️ TravelPlanner

### Plan trips · Track expenses · Manage documents · Get AI-powered insights

A production-grade, full-stack travel management platform — fast, secure, and offline-capable.

<br />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-4F46E5?style=for-the-badge&logo=vercel&logoColor=white)](https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app)

<br />

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## 🌐 Live Demo

**[👉 Open the live app](https://travel-planner-iaok8iyao-saipavans-projects-32f9b141.vercel.app)**

Sign in with Google or an email/password account. All data is fully isolated per user via Supabase Row Level Security.

---

## ✨ Features

| | Feature | Description |
|:--:|:--|:--|
| 🧳 | **Trip Management** | Create trips with destination, dates, budget, and status |
| 🗺️ | **Itinerary Builder** | Day-by-day planner with drag-and-drop reordering |
| 💸 | **Expense Tracking** | Log expenses by category with budget vs. actual insights |
| 📄 | **Document Management** | Store travel documents with expiry tracking |
| ⏰ | **Reminders** | Card, list, and calendar views |
| 📔 | **Travel Journal** | Trip diary with moods, ratings, and photos |
| 🌦️ | **Weather & Nearby** | 7-day forecasts and nearby place search |
| 💱 | **Currency Converter** | Real-time exchange rates |
| 🤖 | **AI Assistant** | Provider-agnostic AI chat via a Supabase Edge Function |
| 📊 | **Analytics** | KPIs, charts, and insights across all trips |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 · TypeScript 5 · Vite 5 · Tailwind CSS 3 · Radix UI (shadcn/ui)
- **State:** TanStack Query v5 · Zustand
- **Routing / Forms:** React Router v6 · React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL · Auth · Storage · Edge Functions)
- **PWA:** vite-plugin-pwa + Workbox
- **Hosting:** Vercel

---

## 📸 Screenshots

> _Add screenshots from the live deployment to showcase the app._

| Dashboard | Trip Detail | Analytics |
|:--:|:--:|:--:|
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## 🚀 Getting Started

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

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=TravelPlanner
VITE_AI_PROVIDER=groq
```

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required. AI provider API keys are stored only as Supabase Edge Function secrets and must never appear in `.env.local` or the frontend bundle.

---

## 📜 Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run type-check # TypeScript check
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

<div align="center">

**Built with React, TypeScript & Supabase — by [Sai Pavan Etikala](https://github.com/esaipavan)**

⭐ If you find this project useful, consider giving it a star!

</div>
