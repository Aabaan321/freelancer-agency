-- ============================================================================
-- Row-Level Security
-- Rule of thumb:
--   • admins  -> full access everywhere
--   • clients -> only rows for THEIR projects, and for client-facing content
--                only when is_published = true
--   • clients can author change_requests + messages on their projects
-- ============================================================================

alter table profiles        enable row level security;
alter table clients         enable row level security;
alter table client_users    enable row level security;
alter table projects        enable row level security;
alter table milestones      enable row level security;
alter table features        enable row level security;
alter table budget_items    enable row level security;
alter table invoices        enable row level security;
alter table contracts       enable row level security;
alter table design_assets   enable row level security;
alter table preview_links   enable row level security;
alter table deliverables    enable row level security;
alter table change_requests enable row level security;
alter table messages        enable row level security;
alter table activity_log    enable row level security;
alter table notifications   enable row level security;

-- ---- profiles -------------------------------------------------------------
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- clients --------------------------------------------------------------
drop policy if exists clients_admin_all on clients;
create policy clients_admin_all on clients for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists clients_member_read on clients;
create policy clients_member_read on clients for select
  using (id in (select public.my_client_ids()));

-- ---- client_users ---------------------------------------------------------
drop policy if exists cu_admin_all on client_users;
create policy cu_admin_all on client_users for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists cu_self_read on client_users;
create policy cu_self_read on client_users for select
  using (profile_id = auth.uid());

-- ---- projects -------------------------------------------------------------
drop policy if exists projects_admin_all on projects;
create policy projects_admin_all on projects for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists projects_client_read on projects;
create policy projects_client_read on projects for select
  using (client_id in (select public.my_client_ids()));

-- ---- milestones (always visible to project members) -----------------------
drop policy if exists milestones_admin_all on milestones;
create policy milestones_admin_all on milestones for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists milestones_client_read on milestones;
create policy milestones_client_read on milestones for select
  using (project_id in (select public.my_project_ids()));

-- Generic "published-gated read for clients" tables -------------------------
-- features
drop policy if exists features_admin_all on features;
create policy features_admin_all on features for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists features_client_read on features;
create policy features_client_read on features for select
  using (is_published and project_id in (select public.my_project_ids()));

-- budget_items
drop policy if exists budget_admin_all on budget_items;
create policy budget_admin_all on budget_items for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists budget_client_read on budget_items;
create policy budget_client_read on budget_items for select
  using (is_published and project_id in (select public.my_project_ids()));

-- invoices
drop policy if exists invoices_admin_all on invoices;
create policy invoices_admin_all on invoices for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists invoices_client_read on invoices;
create policy invoices_client_read on invoices for select
  using (is_published and client_id in (select public.my_client_ids()));

-- contracts
drop policy if exists contracts_admin_all on contracts;
create policy contracts_admin_all on contracts for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists contracts_client_read on contracts;
create policy contracts_client_read on contracts for select
  using (is_published and project_id in (select public.my_project_ids()));
-- clients may sign (update signature fields on their own published contracts)
drop policy if exists contracts_client_sign on contracts;
create policy contracts_client_sign on contracts for update
  using (is_published and project_id in (select public.my_project_ids()))
  with check (is_published and project_id in (select public.my_project_ids()));

-- design_assets
drop policy if exists assets_admin_all on design_assets;
create policy assets_admin_all on design_assets for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists assets_client_read on design_assets;
create policy assets_client_read on design_assets for select
  using (is_published and project_id in (select public.my_project_ids()));

-- preview_links
drop policy if exists previews_admin_all on preview_links;
create policy previews_admin_all on preview_links for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists previews_client_read on preview_links;
create policy previews_client_read on preview_links for select
  using (is_published and project_id in (select public.my_project_ids()));

-- deliverables
drop policy if exists deliverables_admin_all on deliverables;
create policy deliverables_admin_all on deliverables for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists deliverables_client_read on deliverables;
create policy deliverables_client_read on deliverables for select
  using (is_published and project_id in (select public.my_project_ids()));

-- ---- change_requests (clients can create + read their own) ----------------
drop policy if exists cr_admin_all on change_requests;
create policy cr_admin_all on change_requests for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists cr_client_read on change_requests;
create policy cr_client_read on change_requests for select
  using (project_id in (select public.my_project_ids()));
drop policy if exists cr_client_insert on change_requests;
create policy cr_client_insert on change_requests for insert
  with check (project_id in (select public.my_project_ids()) and requested_by = auth.uid());

-- ---- messages (clients can read + send on their projects) -----------------
drop policy if exists messages_admin_all on messages;
create policy messages_admin_all on messages for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists messages_client_read on messages;
create policy messages_client_read on messages for select
  using (project_id in (select public.my_project_ids()));
drop policy if exists messages_client_insert on messages;
create policy messages_client_insert on messages for insert
  with check (project_id in (select public.my_project_ids()) and sender_id = auth.uid());

-- ---- activity_log (read-only for clients on their projects) ---------------
drop policy if exists activity_admin_all on activity_log;
create policy activity_admin_all on activity_log for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists activity_client_read on activity_log;
create policy activity_client_read on activity_log for select
  using (project_id in (select public.my_project_ids()));

-- ---- notifications (own only) ---------------------------------------------
drop policy if exists notif_own on notifications;
create policy notif_own on notifications for select
  using (recipient_id = auth.uid() or public.is_admin());
drop policy if exists notif_own_update on notifications;
create policy notif_own_update on notifications for update
  using (recipient_id = auth.uid());
drop policy if exists notif_admin_insert on notifications;
create policy notif_admin_insert on notifications for insert
  with check (public.is_admin());

-- ============================================================================
-- Realtime
-- ============================================================================
do $$ begin
  alter publication supabase_realtime add table features;
  alter publication supabase_realtime add table milestones;
  alter publication supabase_realtime add table messages;
  alter publication supabase_realtime add table change_requests;
  alter publication supabase_realtime add table design_assets;
  alter publication supabase_realtime add table preview_links;
  alter publication supabase_realtime add table invoices;
  alter publication supabase_realtime add table contracts;
  alter publication supabase_realtime add table budget_items;
  alter publication supabase_realtime add table notifications;
exception when others then null; end $$;
