-- =====================================================================
-- IT Portfolio schema: projects + skills
-- Public visitors can READ published rows only. Nobody can write via the
-- public API. You manage content in the Supabase Table Editor (which uses
-- a privileged role) or the SQL editor.
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
  live_url    text check (live_url   is null or live_url   ~* '^https://'),
  image_url   text check (image_url  is null or image_url  ~* '^https://'),
  featured    boolean not null default false,
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 1 and 60),
  category    text not null check (char_length(category) between 1 and 60),
  level       integer not null default 50 check (level between 0 and 100),
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

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

-- Start from zero privileges for API roles, then grant SELECT only.
revoke all on public.projects from anon, authenticated;
revoke all on public.skills   from anon, authenticated;

grant select on public.projects to anon, authenticated;
grant select on public.skills   to anon, authenticated;

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

-- No INSERT / UPDATE / DELETE policies exist, and those privileges are
-- revoked, so the anon key can never modify data.

-- ---------------------------------------------------------------------
-- Seed data (edit freely, replace your-username / URLs)
-- ---------------------------------------------------------------------
insert into public.projects
  (title, slug, summary, description, tech_stack, github_url, live_url, featured, published, sort_order)
values
  (
    'CareWatch',
    'carewatch',
    'A health-monitoring dashboard that helps caregivers track patient vitals and respond to alerts quickly.',
    'CareWatch gives caregivers a single place to monitor patients, review vitals trends, and receive prioritised alerts. Built with a focus on clarity, accessibility, and secure role-based data access.',
    array['React','Vite','Tailwind CSS','Supabase','PostgreSQL','Vercel'],
    'https://github.com/your-username/carewatch',
    'https://carewatch.example.com',
    true,
    true,
    0
  ),
  (
    'Network Inventory Tracker',
    'network-inventory-tracker',
    'Asset and device inventory tool for small IT teams with search, tagging, and CSV export.',
    'Track servers, switches, laptops and licences in one searchable table with warranty reminders.',
    array['React','Node.js','PostgreSQL'],
    'https://github.com/your-username/network-inventory-tracker',
    null,
    false,
    true,
    1
  ),
  (
    'Helpdesk Ticketing Lite',
    'helpdesk-ticketing-lite',
    'Lightweight ticketing system with status workflow, priorities and email notifications.',
    'A minimal helpdesk for student organisations and small offices.',
    array['JavaScript','Supabase','Tailwind CSS'],
    'https://github.com/your-username/helpdesk-ticketing-lite',
    null,
    false,
    true,
    2
  ),
  (
    'Server Health Monitor',
    'server-health-monitor',
    'Scripts and dashboard for tracking uptime, CPU, memory and disk usage across Linux hosts.',
    'Collects metrics with shell scripts and visualises them in a small web dashboard.',
    array['Linux','Bash','Python','Grafana'],
    'https://github.com/your-username/server-health-monitor',
    null,
    false,
    true,
    3
  )
on conflict (slug) do nothing;

insert into public.skills (name, category, level, published, sort_order)
values
  ('JavaScript',        'Frontend',        90, true, 0),
  ('React',             'Frontend',        88, true, 1),
  ('Tailwind CSS',      'Frontend',        90, true, 2),
  ('HTML & CSS',        'Frontend',        92, true, 3),
  ('Node.js',           'Backend',         78, true, 0),
  ('PostgreSQL',        'Backend',         80, true, 1),
  ('Supabase',          'Backend',         82, true, 2),
  ('REST APIs',         'Backend',         85, true, 3),
  ('Git & GitHub',      'DevOps & Tools',  88, true, 0),
  ('Vercel',            'DevOps & Tools',  80, true, 1),
  ('Linux',             'DevOps & Tools',  75, true, 2),
  ('Networking Basics', 'DevOps & Tools',  72, true, 3)
on conflict (name) do nothing;