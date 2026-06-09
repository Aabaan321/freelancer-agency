# Aureon Studio

A premium boutique-agency website with a glassmorphism design system, a signature loading sequence, scroll-driven marketing pages, and **two deep portals** — an admin control center and a client portal where everything about a project lives.

Built with **Next.js 16** (App Router, React 19, Server Actions), **Supabase** (Auth + Postgres + Realtime + RLS), **Tailwind**, and **Framer Motion**.

---

## The big idea

The client portal surfaces *everything* about an engagement — budget, prototype/design gallery, a live device-framed preview of the actual site, a **feature checklist** (what the client asked for → how far along it is), invoices, and a view-and-sign **contract**. The admin decides **what the client sees and when**: nearly every client-facing row has an `is_published` flag, and **row-level security enforces that clients only ever read published rows for their own projects.** Flip a toggle in the admin and it appears in the client's portal in realtime.

---

## What's in it

**Marketing site** (public)
- Signature loading screen — morphing chrome/iridescent orb, letter-by-letter wordmark reveal, live % counter, clip-path "wipe" exit (once per session)
- Animated aurora background, glass surfaces, iridescent text/borders, grain, smooth scroll (Lenis), scroll-progress
- Home, Services, AI Studio, Process, About, Work, Pricing, Contact, FAQ + AI chat widget

**Admin portal** (`/admin`) — the control center
- Dashboard (KPIs + activity), clients (+ add-client wizard that provisions a real login), projects
- Per-project workspace with full control + **publish toggles** on every item
- Cross-project change-request inbox, invoices overview, settings

**Client portal** (`/client`)
- Dashboard with live progress on every project
- Project workspace tabs: **Checklist** (with % complete), **Budget** breakdown, **Design** gallery (lightbox), **Preview** (device-framed iframe), **Invoices**, **Contract** (view + e-sign), **Change requests**, **Messages**
- Realtime: the checklist ticks over the moment the admin marks something done or publishes it

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the Supabase keys (see below)
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
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | admin wizard only | Needed only to provision new client logins from the admin "add client" form |
| `OPENAI_API_KEY` | optional | Chat widget degrades gracefully without it |
| `NEXT_PUBLIC_SITE_URL` | yes | OG / metadata |

The public site renders fine even with no Supabase configured (middleware bounces portal routes to `/login`).

---

## Database

Schema + RLS + realtime live in [`supabase/migrations/`](supabase/migrations). Apply them to a fresh Supabase project (e.g. via the Supabase SQL editor or MCP) in order: `0001_init.sql`, `0002_rls.sql`, then optionally `seed_demo` for the demo data.

Tables: `profiles`, `clients`, `client_users`, `projects`, `milestones`, **`features`** (the checklist), **`budget_items`**, **`design_assets`** (prototype gallery), `preview_links`, `invoices`, **`contracts`**, `deliverables`, `change_requests`, `messages`, `activity_log`, `notifications`.

RLS rule of thumb: **admins** get full access; **clients** read only `is_published` rows for their own projects, and may author change-requests, messages, and contract signatures. Realtime is enabled on all client-facing tables.

---

## Architecture

```
app/
├─ (marketing)/   public site
├─ (auth)/login/  role-routed sign-in
├─ admin/         control center (canManage = true)
├─ client/        client portal (canManage = false)
├─ api/chat/      rate-limited OpenAI proxy
└─ actions.ts     server actions (publish gate, checklist, budget, invoices, contracts, messages…)

components/
├─ fx/            aurora background, loader
├─ motion/        Reveal, Stagger, Parallax, Magnetic, CountUp, SmoothScroll, ScrollProgress
├─ marketing/     navbar, footer, hero, chat widget
├─ portal/        project-workspace + shared panels (checklist, budget, design, preview,
│                 invoices, contract, change-requests, messages, publish-toggle, realtime-refresh)
└─ ui/            shadcn-style primitives

lib/  config · ai/system-prompt · supabase/{client,server,types} · currency · rate-limit · utils
proxy.ts          auth + role-gate middleware
```

The two project workspaces (admin + client) render the **same** `ProjectWorkspace` component — RLS does the filtering, and a single `canManage` prop flips on the admin's edit/publish controls.
