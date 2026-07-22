# Changelog

All notable changes to TravelMate are documented here.

---

## [Unreleased]

- Collaborative trips with shared expense splitting
- Push notifications via Web Push API
- AI-generated one-click itineraries
- PDF trip export
- Offline mutation queue with auto-sync
- E2E Playwright test suite

---

## [1.0.2] — 2026-07-18

### Fixed
- Nearby Places API integration — corrected Overpass API query and error handling

---

## [1.0.1] — 2026-07-17

### Fixed
- Mobile UX regressions on trip detail and expense log screens
- Production environment issues with Supabase auth redirect URLs

---

## [1.0.0] — 2026-07-17

### Added
- Full trip management with itinerary builder and drag-and-drop reordering (@dnd-kit)
- Expense tracking across 9 categories with budget visualization and over-budget alerts
- Document management with expiry tracking (Expiring Soon / Expired status)
- Travel journal with mood selection, star ratings, and photo uploads
- Reminders with Card, List, and Calendar views and repeat patterns
- Analytics dashboard: 8 KPI cards and 6 chart types (Area, Pie, Bar)
- AI assistant powered by a provider-agnostic Supabase Edge Function proxy (Groq → Gemini → OpenRouter fallback)
- Weather forecast via Open-Meteo (7-day, no API key required)
- Nearby places via OpenStreetMap Overpass API
- Currency converter via Frankfurter (30+ currencies)
- Destination intelligence: country profiles and Wikipedia summaries
- User profile with avatar upload stored in Supabase Storage
- Admin panel (role-gated): user management, feature flags, AI usage logs
- PWA: Workbox service worker pre-caching, offline shell, install prompt, sync indicator
- Google OAuth + email/password authentication via Supabase Auth
- Row Level Security enforced on all PostgreSQL tables
- Content Security Policy via vercel.json
- Lighthouse scores: 98 Performance / 100 Accessibility / 100 Best Practices / 92 SEO

### Performance
- Rollup manual chunking into 15+ named chunks with stable content hashes
- React.memo on KPICards, InsightsPanel, InsightCard, QuickActions
- Shared O(n) expense map replacing triple O(n×m) scans across analytics charts
- All 30+ routes are React.lazy() — zero authenticated code downloaded by unauthenticated users

### Security
- Zero AI provider API keys in client bundle — all keys stored in Supabase Edge Function secrets
- JWT verification on every AI chat request before any provider call
- No source maps in production build

---

## [0.9.0] — 2026-07-16

### Added
- Mobile responsiveness improvements across all feature pages
- Trip-scoped expense and checklist modules
- Reminders migration (migration 009)

### Added (earlier)
- Production security hardening: CSP, security headers, X-Frame-Options
- Bundle optimization and lazy-loading for all authenticated routes
- PWA support with Workbox and vite-plugin-pwa
- User Profile & Settings page with avatar management
- Analytics Dashboard with KPI cards and Recharts visualizations
- Supabase Storage integration for avatars, documents, and journal photos
