-- ============================================================================
-- Demo seed — admin + client logins and one fully-populated project that
-- deliberately mixes published/unpublished rows so the publish gate is visible.
-- Demo creds: admin@aureon.studio / Aureon2026!  ·  demo@client.com / Demo2026!
-- (auth users are seeded directly via bcrypt; in production use the admin API.)
-- ============================================================================
do $$
declare
  admin_id uuid := gen_random_uuid();
  cli_id   uuid := gen_random_uuid();
  v_client uuid;
  v_project uuid;
  m_disc uuid; m_design uuid; m_build uuid; m_launch uuid;
begin
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change, email_change_token_new)
  values ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
    'admin@aureon.studio', crypt('Aureon2026!', gen_salt('bf')), now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Aureon Admin","role":"admin"}', '', '', '', '');
  insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (admin_id::text, admin_id, jsonb_build_object('sub', admin_id::text, 'email', 'admin@aureon.studio', 'email_verified', true), 'email', now(), now(), now());

  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change, email_change_token_new)
  values ('00000000-0000-0000-0000-000000000000', cli_id, 'authenticated', 'authenticated',
    'demo@client.com', crypt('Demo2026!', gen_salt('bf')), now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Layla Haddad","role":"client"}', '', '', '', '');
  insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (cli_id::text, cli_id, jsonb_build_object('sub', cli_id::text, 'email', 'demo@client.com', 'email_verified', true), 'email', now(), now(), now());

  update profiles set role='admin',  full_name='Aureon Admin', currency='AED' where id = admin_id;
  update profiles set role='client', full_name='Layla Haddad', currency='AED' where id = cli_id;

  insert into clients (name, company, primary_contact_id, status, notes)
  values ('Mandara Studio', 'Mandara Hospitality', cli_id, 'active', 'Boutique resort brand — full rebrand + site.')
  returning id into v_client;
  insert into client_users (client_id, profile_id, role_at_client) values (v_client, cli_id, 'owner');

  insert into projects (client_id, name, slug, description, status, budget_total, currency, start_date, target_date, staging_url)
  values (v_client, 'Mandara — Brand & Site', 'mandara-brand-site',
    'A full rebrand and a premium marketing site with online booking for a boutique resort group.',
    'build', 48000, 'AED', current_date - 20, current_date + 15, 'https://example.com')
  returning id into v_project;

  insert into milestones (project_id, title, order_index, status) values (v_project,'Discovery',0,'done')     returning id into m_disc;
  insert into milestones (project_id, title, order_index, status) values (v_project,'Design',1,'in_progress') returning id into m_design;
  insert into milestones (project_id, title, order_index, status) values (v_project,'Build',2,'pending')      returning id into m_build;
  insert into milestones (project_id, title, order_index, status) values (v_project,'Launch',3,'pending')     returning id into m_launch;

  insert into features (project_id, milestone_id, title, description, category, status, requested_by_client, order_index, is_published, published_at, completed_at) values
    (v_project, m_disc,   'Brand discovery workshop',      'Positioning, audience, tone of voice.', 'Discovery', 'done',        false, 0, true,  now(), now()),
    (v_project, m_design, 'Logo & identity system',        'Primary mark, palette, typography.',    'Design',    'done',        true,  1, true,  now(), now()),
    (v_project, m_design, 'Homepage high-fidelity design', 'Hero, rooms, story, booking CTA.',      'Design',    'in_progress', true,  2, true,  now(), null),
    (v_project, m_build,  'Responsive marketing site',     'Next.js build, CMS-driven content.',    'Build',     'in_progress', false, 3, true,  now(), null),
    (v_project, m_build,  'Online booking integration',    'Availability calendar + payment.',      'Build',     'planned',     true,  4, true,  now(), null),
    (v_project, m_build,  'Multi-language (EN / AR)',       'Full RTL support for Arabic.',          'Build',     'requested',   true,  5, false, null,  null),
    (v_project, m_launch, 'SEO + analytics setup',         'Schema, sitemap, GA4 dashboards.',      'Launch',    'planned',     false, 6, true,  now(), null);

  insert into budget_items (project_id, label, description, category, amount, currency, order_index, is_published) values
    (v_project, 'Brand identity',      'Logo, system, guidelines',  'Design', 12000, 'AED', 0, true),
    (v_project, 'Website design',      'Full high-fidelity design', 'Design', 14000, 'AED', 1, true),
    (v_project, 'Website build',       'Next.js + headless CMS',    'Build',  16000, 'AED', 2, true),
    (v_project, 'Booking integration', 'Calendar + payments',       'Build',   6000, 'AED', 3, false);

  insert into design_assets (project_id, kind, title, url, caption, order_index, is_published, published_at) values
    (v_project, 'mockup', 'Homepage concept — Direction A', 'https://picsum.photos/seed/mandara-home/1280/800', 'Warm minimal. Editorial hero with booking inline.', 0, true,  now()),
    (v_project, 'mockup', 'Rooms & suites layout',          'https://picsum.photos/seed/mandara-rooms/1280/800','Immersive gallery with sticky booking rail.',       1, true,  now()),
    (v_project, 'figma',  'Clickable Figma prototype',      'https://www.figma.com/',                           'Full flow — home to checkout.',                      2, true,  now()),
    (v_project, 'mockup', 'Story page (WIP)',               'https://picsum.photos/seed/mandara-story/1280/800','Heritage narrative — still in review.',              3, false, null);

  insert into preview_links (project_id, label, url, kind, is_pinned, is_published) values
    (v_project, 'Staging site',    'https://example.com',    'staging', true,  true),
    (v_project, 'Figma prototype', 'https://www.figma.com/', 'figma',   false, true);

  insert into invoices (client_id, project_id, number, amount, currency, status, line_items, issued_at, due_at, is_published, paid_at) values
    (v_client, v_project, 'AUR-2026-001', 24000, 'AED', 'paid', '[{"label":"Project deposit (50%)","amount":24000}]'::jsonb, current_date - 18, current_date - 4, true, now() - interval '3 days'),
    (v_client, v_project, 'AUR-2026-002', 24000, 'AED', 'sent', '[{"label":"Final payment (50%)","amount":24000}]'::jsonb, current_date, current_date + 14, true, null);

  insert into contracts (project_id, client_id, title, body, status, is_published, sent_at) values
    (v_project, v_client, 'Master Services Agreement',
     E'# Master Services Agreement\n\n**Between** Aureon Studio (the "Studio") **and** Mandara Hospitality (the "Client").\n\n## 1. Scope\nThe Studio will deliver a complete brand identity and a premium marketing website with online booking, as detailed in the project plan.\n\n## 2. Timeline\nApproximately 21 working days from kickoff, subject to timely Client feedback.\n\n## 3. Investment\nAED 48,000, invoiced 50% on signing and 50% on launch.\n\n## 4. Ownership\nAll final deliverables transfer to the Client upon receipt of full payment.\n\n## 5. Confidentiality\nBoth parties agree to keep shared materials confidential.\n\n_By signing below, the Client agrees to the terms above._',
     'sent', true, now());

  insert into activity_log (actor_id, entity_type, project_id, action) values
    (admin_id, 'project', v_project, 'Project created'),
    (admin_id, 'feature', v_project, 'Published homepage design for review'),
    (admin_id, 'invoice', v_project, 'Sent final invoice AUR-2026-002');
end $$;
