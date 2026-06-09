-- ============================================================================
-- Aureon Studio — full schema (rebuilt from scratch)
-- Theme: a client portal that surfaces EVERYTHING about a project — budget,
-- prototypes, live preview, a feature checklist, invoices, contracts — but only
-- what the admin has explicitly *published*. Admin controls the "when".
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------------------------
do $$ begin
  create type user_role        as enum ('admin', 'client');
  create type project_status   as enum ('lead', 'discovery', 'design', 'build', 'review', 'launched', 'paused', 'archived');
  create type milestone_status as enum ('pending', 'in_progress', 'done');
  create type feature_status   as enum ('requested', 'planned', 'in_progress', 'review', 'done', 'wont_do');
  create type cr_status        as enum ('open', 'in_review', 'accepted', 'declined', 'done');
  create type invoice_status   as enum ('draft', 'sent', 'paid', 'overdue', 'void');
  create type contract_status  as enum ('draft', 'sent', 'signed', 'declined');
  create type asset_kind       as enum ('prototype', 'mockup', 'figma', 'image', 'video', 'loom', 'doc', 'other');
  create type preview_kind     as enum ('figma', 'staging', 'live', 'loom', 'other');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- Core identity
-- ============================================================================
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'client',
  phone       text,
  locale      text default 'en',
  currency    text default 'AED',
  created_at  timestamptz not null default now()
);

create table if not exists clients (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  company            text,
  primary_contact_id uuid references profiles(id) on delete set null,
  logo_url           text,
  status             text not null default 'active',
  notes              text,
  created_at         timestamptz not null default now()
);

create table if not exists client_users (
  client_id      uuid not null references clients(id) on delete cascade,
  profile_id     uuid not null references profiles(id) on delete cascade,
  role_at_client text default 'member',
  created_at     timestamptz not null default now(),
  primary key (client_id, profile_id)
);

-- ============================================================================
-- Projects + planning
-- ============================================================================
create table if not exists projects (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid not null references clients(id) on delete cascade,
  name             text not null,
  slug             text not null,
  description      text,
  status           project_status not null default 'discovery',
  budget_total     numeric(12,2) default 0,
  currency         text not null default 'AED',
  progress_override int,                     -- null = computed from features
  start_date       date,
  target_date      date,
  staging_url      text,
  live_url         text,
  cover_url        text,
  created_at       timestamptz not null default now()
);
create index if not exists idx_projects_client on projects(client_id);

create table if not exists milestones (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  title        text not null,
  description  text,
  order_index  int not null default 0,
  status       milestone_status not null default 'pending',
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_milestones_project on milestones(project_id);

-- The feature checklist: what the client asked for + how far along it is.
create table if not exists features (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects(id) on delete cascade,
  milestone_id        uuid references milestones(id) on delete set null,
  title               text not null,
  description         text,
  category            text default 'General',
  status              feature_status not null default 'requested',
  requested_by_client boolean not null default false,
  order_index         int not null default 0,
  is_published        boolean not null default false,  -- admin publish gate
  published_at        timestamptz,
  completed_at        timestamptz,
  created_at          timestamptz not null default now()
);
create index if not exists idx_features_project on features(project_id);

-- ============================================================================
-- Money: budget breakdown + invoices + contracts
-- ============================================================================
create table if not exists budget_items (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  label        text not null,
  description  text,
  category     text default 'General',
  amount       numeric(12,2) not null default 0,
  currency     text not null default 'AED',
  order_index  int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_budget_project on budget_items(project_id);

create table if not exists invoices (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references clients(id) on delete cascade,
  project_id   uuid references projects(id) on delete set null,
  number       text not null,
  amount       numeric(12,2) not null default 0,
  currency     text not null default 'AED',
  status       invoice_status not null default 'draft',
  line_items   jsonb not null default '[]'::jsonb,
  issued_at    date,
  due_at       date,
  paid_at      timestamptz,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_invoices_project on invoices(project_id);

create table if not exists contracts (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  client_id    uuid references clients(id) on delete set null,
  title        text not null,
  body         text,            -- markdown contract body
  file_url     text,            -- optional PDF
  status       contract_status not null default 'draft',
  is_published boolean not null default false,
  sent_at      timestamptz,
  signed_at    timestamptz,
  signed_name  text,
  signed_ip    text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_contracts_project on contracts(project_id);

-- ============================================================================
-- Visual artifacts: prototype/design gallery + live previews + files
-- ============================================================================
create table if not exists design_assets (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  kind          asset_kind not null default 'image',
  title         text not null,
  url           text not null,
  thumbnail_url text,
  caption       text,
  order_index   int not null default 0,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists idx_assets_project on design_assets(project_id);

create table if not exists preview_links (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  label        text not null,
  url          text not null,
  kind         preview_kind not null default 'staging',
  is_pinned    boolean not null default false,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_previews_project on preview_links(project_id);

create table if not exists deliverables (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  file_path    text not null,
  file_name    text not null,
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  uuid references profiles(id) on delete set null,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_deliverables_project on deliverables(project_id);

-- ============================================================================
-- Collaboration: change requests + messages
-- ============================================================================
create table if not exists change_requests (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references projects(id) on delete cascade,
  feature_id     uuid references features(id) on delete set null,
  requested_by   uuid references profiles(id) on delete set null,
  title          text not null,
  body           text not null,
  urgency        text default 'normal',
  status         cr_status not null default 'open',
  admin_response text,
  resolved_at    timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists idx_cr_project on change_requests(project_id);

create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  sender_id   uuid references profiles(id) on delete set null,
  body        text not null,
  attachments jsonb not null default '[]'::jsonb,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists idx_messages_project on messages(project_id);

-- ============================================================================
-- System: activity log + notifications
-- ============================================================================
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles(id) on delete set null,
  entity_type text not null,
  entity_id   uuid,
  project_id  uuid references projects(id) on delete cascade,
  action      text not null,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists idx_activity_project on activity_log(project_id);

create table if not exists notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  type         text not null,
  title        text not null,
  body         text,
  link         text,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_notifications_recipient on notifications(recipient_id);

-- ============================================================================
-- Helper functions (security definer to avoid RLS recursion)
-- ============================================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.my_client_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select client_id from client_users where profile_id = auth.uid()
  union
  select id from clients where primary_contact_id = auth.uid();
$$;

create or replace function public.my_project_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from projects where client_id in (select public.my_client_ids());
$$;

-- New auth user -> profile row
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
