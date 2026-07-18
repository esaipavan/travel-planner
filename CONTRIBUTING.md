# Contributing to TravelPlanner

Thank you for your interest in contributing! This document explains how to get set up locally and what to keep in mind before opening a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful and constructive. Issues and pull requests that contain harassment or personal attacks will be closed immediately.

---

## Getting Started

1. **Fork** the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/travel-planner.git
   cd travel-planner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`** by copying the example and filling in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Apply database migrations** (requires [Supabase CLI](https://supabase.com/docs/guides/cli)):
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes. Before committing, run all checks:
   ```bash
   npm run type-check   # TypeScript strict — must be zero errors
   npm run lint         # ESLint — zero warnings policy
   npm run format       # Prettier formatting
   npm run build        # Production build — must succeed
   ```

3. All four checks must pass before opening a pull request.

---

## Pull Request Guidelines

- **One PR per concern** — separate bug fixes from feature additions.
- **Keep PRs small** — large diffs are hard to review and slow to merge.
- **Reference an issue** — link to an open issue in the PR description if one exists (`Closes #123`).
- **Describe the change** — explain what changed and why, not just what the code does.
- **Screenshots for UI changes** — include before/after screenshots in the PR description.
- **No breaking changes without discussion** — if your change affects the public API or database schema, open an issue first.

---

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

Common types:

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Restructuring without adding features or fixing bugs |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build scripts, dependencies, config |

Examples:
```
feat(expenses): add CSV export for expense history
fix(auth): handle token refresh on 401 response
docs(readme): update environment variable table
```

---

## Code Style

- **TypeScript strict mode** — `noUnusedLocals` and `noUnusedParameters` are enforced. No `any` types without an explicit comment explaining why.
- **Feature-Sliced Architecture** — new functionality belongs in the relevant feature folder under `src/features/`. Cross-feature imports go through the feature's public barrel (`index.ts`).
- **Service layer** — all Supabase calls and external API calls go through typed service functions in `features/<name>/services/`. Route handlers and components must not import Supabase directly.
- **RLS everywhere** — if you add a new database table, add a corresponding RLS policy in a new migration file.
- **No secrets in client code** — API keys belong in Supabase Edge Function secrets only.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/esaipavan/travel-planner/issues/new) and include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser, OS, and Node.js version
- Any relevant console errors or screenshots

For **security vulnerabilities**, please follow the process in [SECURITY.md](SECURITY.md) instead of opening a public issue.

---

## Suggesting Features

Open a [GitHub Issue](https://github.com/esaipavan/travel-planner/issues/new) with the label `enhancement`. Describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

Feature requests are welcome. Complex features are discussed in the issue before any implementation begins.
