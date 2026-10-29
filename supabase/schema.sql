-- =====================================================================
-- IT Portfolio schema: projects + skills
-- Public visitors can READ published rows only. The portfolio admin account
-- can manage projects, skills, settings, and uploaded portrait assets.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary     text not null check (char_length(summary) between 1 and 400),
  description text check (description is null or char_length(description) <= 4000),
  tech_stack  text[] not null default '{}',
  github_url  text check (github_url is null or github_url ~* '^https://'),
  github_label text,
  project_type text,
  website_code_url text check (website_code_url is null or website_code_url ~* '^https://'),
  mobile_code_url text check (mobile_code_url is null or mobile_code_url ~* '^https://'),
  live_url    text check (live_url   is null or live_url   ~* '^https://'),
  image_url   text check (image_url  is null or image_url  ~* '^https://'),
  featured    boolean not null default false,
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.projects
  add column if not exists github_label text,
  add column if not exists project_type text,
  add column if not exists website_code_url text check (website_code_url is null or website_code_url ~* '^https://'),
  add column if not exists mobile_code_url text check (mobile_code_url is null or mobile_code_url ~* '^https://');

create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 1 and 60),
  category    text not null check (char_length(category) between 1 and 60),
  level       integer not null default 50 check (level between 0 and 100),
  icon        text,
  image_url   text check (image_url is null or image_url ~* '^https://'),
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.skills
  add column if not exists icon text,
  add column if not exists image_url text check (image_url is null or image_url ~* '^https://');

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  portrait_url text not null default '/john-lloyd-melu.png'
);

create table if not exists public.admin_login_attempts (
  attempt_key text primary key,
  attempts integer not null default 0 check (attempts between 0 and 2),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, portrait_url)
values (true, '/john-lloyd-melu.png')
on conflict (id) do nothing;

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order);
create index if not exists skills_published_sort_idx
  on public.skills (published, category, sort_order);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.skills   enable row level security;

-- Start from zero privileges for API roles, then grant public read and
-- authenticated writes protected by the admin-only RLS policies below.
revoke all on public.projects from anon, authenticated;
revoke all on public.skills   from anon, authenticated;
revoke all on public.site_settings from anon, authenticated;
revoke all on public.admin_login_attempts from public, anon, authenticated;
grant all on public.admin_login_attempts to service_role;

grant select on public.projects to anon, authenticated;
grant select on public.skills   to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.projects, public.skills, public.site_settings to authenticated;

-- Read-only policies: only published rows are visible.
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public can read published skills" on public.skills;
create policy "Public can read published skills"
  on public.skills
  for select
  to anon, authenticated
  using (published = true);

alter table public.site_settings enable row level security;
alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from public, anon, authenticated;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Portfolio admin manages projects" on public.projects;
create policy "Portfolio admin manages projects"
  on public.projects for all to authenticated
  using (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

drop policy if exists "Portfolio admin manages skills" on public.skills;
create policy "Portfolio admin manages skills"
  on public.skills for all to authenticated
  using (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

drop policy if exists "Portfolio admin updates site settings" on public.site_settings;
create policy "Portfolio admin updates site settings"
  on public.site_settings for all to authenticated
  using (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Portfolio admin uploads assets" on storage.objects;
create policy "Portfolio admin uploads assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-assets' and lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

drop policy if exists "Portfolio admin updates assets" on storage.objects;
create policy "Portfolio admin updates assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-assets' and lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com')
  with check (bucket_id = 'portfolio-assets' and lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

drop policy if exists "Portfolio admin deletes assets" on storage.objects;
create policy "Portfolio admin deletes assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-assets' and lower(auth.jwt() ->> 'email') = 'johnlloydmelu2004@gmail.com');

-- ---------------------------------------------------------------------
-- Seed data (edit freely, replace your-username / URLs)
-- ---------------------------------------------------------------------
delete from public.projects
where slug in ('network-inventory-tracker', 'helpdesk-ticketing-lite', 'server-health-monitor');

insert into public.projects
  (title, slug, summary, description, tech_stack, github_url, github_label, project_type, website_code_url, mobile_code_url, live_url, featured, published, sort_order)
values
  (
    'Smart Campus Companion',
    'smart-campus-companion',
    'Mobile app for campus information, academic schedules, tasks, and announcements.',
    null,
    array['Mobile'],
    'https://github.com/johnlloydmelu/SmartCampusCompanion',
    'Mobile Code',
    'Mobile',
    null,
    null,
    null,
    true,
    true,
    0
  ),
  (
    'CareWatch',
    'carewatch',
    'Capstone system for monitoring resident health, managing records, and sending real-time caregiver alerts.',
    null,
    array['Web','Mobile','Wearable'],
    null,
    null,
    'Website + Mobile',
    'https://github.com/dyeykob24/Capstone_Web_Health_Monitoring',
    'https://github.com/r-lovete-dev/Wearable-Watch-Vitals',
    null,
    false,
    true,
    1
  ),
  (
    'CabRent',
    'cabrent',
    'Rental listing platform for browsing, searching, and managing properties in Cabuyao City.',
    null,
    array['Web','Property Listings'],
    'https://github.com/johnlloydmelu/rental_system',
    'Website Code',
    'Website',
    null,
    null,
    null,
    false,
    true,
    2
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  github_url = excluded.github_url,
  github_label = excluded.github_label,
  project_type = excluded.project_type,
  website_code_url = excluded.website_code_url,
  mobile_code_url = excluded.mobile_code_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

delete from public.skills where name in ('Tailwind CSS', 'Vercel', 'Node.js');

insert into public.skills (name, category, level, icon, published, sort_order)
values
  ('JavaScript',        'Frontend',        90, 'javascript', true, 0),
  ('PHP',               'Backend',         75, 'php', true, 4),
  ('Java',              'Languages',       80, 'devicon:java', true, 0),
  ('C#',                'Languages',       75, 'devicon:csharp', true, 1),
  ('Kotlin',            'Mobile',          75, 'kotlin', true, 2),
  ('Flutter',            'Mobile',          75, 'flutter', true, 3),
  ('MySQL',             'Backend',         80, 'mysql', true, 5),
  ('React',             'Frontend',        88, 'react', true, 1),
  ('CSS Frameworks',    'Frontend',        85, '', true, 2),
  ('HTML & CSS',        'Frontend',        92, 'html5', true, 3),
  ('PostgreSQL',        'Backend',         80, 'postgresql', true, 1),
  ('Supabase',          'Backend',         82, 'supabase', true, 2),
  ('REST APIs',         'Backend',         85, '', true, 3),
  ('Git & GitHub',      'DevOps & Tools',  88, 'github', true, 0),
  ('Linux',             'DevOps & Tools',  75, 'linux', true, 2),
  ('Networking Basics', 'DevOps & Tools',  72, '', true, 3)
on conflict (name) do update set
  category = excluded.category,
  level = excluded.level,
  icon = excluded.icon,
  published = excluded.published,
  sort_order = excluded.sort_order;
