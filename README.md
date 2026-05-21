# Aureon Studio

A premium boutique-agency website with a built-in **admin portal** and **client portal**.

Built with Next.js 15 (App Router), Supabase (Auth + Postgres + Realtime + RLS), Tailwind, Framer Motion, and OpenAI.

---

## What's in it

**Marketing site** (public)

- Premium hero with animated particles, gradient mesh, split-text animation
- Lenis smooth scroll, magnetic CTAs, scroll-progress bar, custom cursor
- Services, AI Studio, Process, About, Work (with per-case-study deep-dive pages), Pricing, Contact, FAQ
- Multi-currency-aware AI chat widget (rate-limited, OpenAI-powered)
- 15-language locale infrastructure (English populated; others scaffolded)
- Dark theme with gold accent palette

**Admin portal** at `/admin`

- Dashboard: KPIs, recent activity feed, upcoming milestones
- Clients: list, detail, **add-client wizard that auto-creates auth user + seeds starter project**
- Projects: workspace with tasks (status flow: todo → in_progress → review → done), milestones, preview links, change-requests inbox, messages
- Change-requests cross-project inbox with structured accept/decline/done responses
- Invoices list, settings page

**Client portal** at `/client`

- Dashboard: progress on every project, recent activity
- Project page: **live task checklist** (updates in realtime via Supabase Realtime when admin marks something done), **embedded preview iframe** with device-frame toggle (desktop/tablet/mobile), file downloads, messages, change-requests
- "Request changes" CTA on every task — structured form (title, body, urgency)
- Realtime updates on tasks, messages, and change-request responses

---

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in OPENAI_API_KEY and SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Open http://localhost:3000

**Demo accounts (seeded):**

- Admin — `admin@aureon.studio` · `Aureon2026!`
- Client — `demo@client.com` · `Demo2026!`

---

## Environment

| Var | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Pre-set to seeded project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Pre-set |
| `SUPABASE_SERVICE_ROLE_KEY` | yes (admin only) | Needed to provision client auth users from the admin wizard |
| `OPENAI_API_KEY` | optional | Chat widget gracefully degrades without |
| `RESEND_API_KEY` | optional | For welcome-email integration (UI in place) |
| `NEXT_PUBLIC_SITE_URL` | yes | Used for OG, sitemap, etc. |

---

## Architecture

```
app/
├─ (marketing)/      # Public site (Home, Services, About, Projects, Pricing, Contact, FAQ)
├─ (auth)/login/     # Single sign-in, role-routed
├─ admin/            # Admin shell + pages (sidebar, role gate via proxy.ts)
├─ client/           # Client shell + pages
└─ api/chat/         # Rate-limited OpenAI proxy

components/
├─ ui/               # Buttons, cards, dialogs, etc. (shadcn-style)
├─ motion/           # FadeIn, Stagger, SplitText, Magnetic, Cursor, SmoothScroll
├─ marketing/        # Navbar, Footer, Hero, ChatWidget, etc.
├─ admin/            # TaskBoard, PreviewLinksManager, ChangeRequestsList
├─ client/           # ChangeRequestDialog, PreviewLinksClient, request UI
└─ portal/           # Shared sidebar, page header, messages panel

lib/
├─ config.ts         # SINGLE source of truth for team, pricing, business constants
├─ ai/system-prompt.ts  # Single OpenAI system prompt — no more dupes
├─ supabase/{client,server,types}.ts
├─ case-studies.ts   # Case-study data for /projects
├─ currency.ts       # Multi-currency conversion
├─ rate-limit.ts     # In-memory rate limiter for /api/chat
└─ utils.ts

supabase/            # SQL migrations applied via MCP
proxy.ts             # Auth + role-gate middleware (Next 16 naming)
```

### Database

13 tables: `profiles`, `clients`, `client_users`, `projects`, `milestones`, `tasks`, `deliverables`, `preview_links`, `change_requests`, `messages`, `invoices`, `activity_log`, `notifications`.

Row-level security enforces:
- Admins → full access
- Clients → only their own projects, tasks (with `client_visible=true`), deliverables, previews, messages, change requests, invoices

Realtime is enabled on `tasks`, `milestones`, `messages`, `change_requests`, `notifications`, `preview_links`, `deliverables`.

---

## What's intentionally out of scope (for now)

- Live Stripe processing (UI + intent stub in place, no live keys)
- Resend email sending (UI in place, transport not wired)
- Locale-prefixed routing (all 15 locale files scaffolded — wire next-intl plugin to enable)
- File upload UI on admin side (storage bucket + policies in place)
- White-label per-client theming (settings page in place)
