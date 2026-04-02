-- ============================================================
-- RELEVANT. Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────
create type platform_type as enum ('instagram', 'tiktok', 'linkedin');
create type role_type as enum ('creator', 'coach', 'dienstleister');
create type plan_type as enum ('free', 'starter', 'pro', 'agency');
create type analysis_status as enum ('pending', 'running', 'completed', 'failed');
create type finding_type as enum ('diagnosis', 'lever');
create type priority_type as enum ('high', 'medium', 'low');
create type score_category as enum ('positioning', 'audience', 'hooks', 'scripts', 'freebie');
create type asset_type as enum ('hook', 'script', 'content_plan');
create type credit_reason as enum (
  'profile_analysis',
  'hook_pack',
  'script_pack',
  'content_plan',
  'freebie_check',
  'plan_grant',
  'manual_adjustment'
);

-- ── Users ───────────────────────────────────────────────────
-- Supabase auth.users handles authentication
-- We extend with a profiles table

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  name        text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Workspaces ──────────────────────────────────────────────
create table public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'Mein Workspace',
  plan        plan_type not null default 'free',
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz default now()
);

alter table public.workspaces enable row level security;

create policy "Owners can manage workspace"
  on public.workspaces for all
  using (auth.uid() = owner_id);

-- ── Social Profiles ─────────────────────────────────────────
-- A "social profile" is the analysed Instagram/TikTok/LinkedIn account

create table public.social_profiles (
  id              uuid primary key default uuid_generate_v4(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  platform        platform_type not null,
  role            role_type not null,
  goals           text[] not null default '{}',
  profile_url     text,
  bio_text        text,
  has_freebie     boolean not null default false,
  freebie_text    text,
  created_at      timestamptz default now()
);

alter table public.social_profiles enable row level security;

create policy "Workspace members can manage social profiles"
  on public.social_profiles for all
  using (
    workspace_id in (
      select id from public.workspaces where owner_id = auth.uid()
    )
  );

-- ── Analyses ────────────────────────────────────────────────
create table public.analyses (
  id               uuid primary key default uuid_generate_v4(),
  social_profile_id uuid not null references public.social_profiles(id) on delete cascade,
  status           analysis_status not null default 'pending',
  relevant_score   integer check (relevant_score between 0 and 100),
  created_at       timestamptz default now(),
  completed_at     timestamptz
);

alter table public.analyses enable row level security;

create policy "Access via social profile workspace"
  on public.analyses for all
  using (
    social_profile_id in (
      select sp.id from public.social_profiles sp
      join public.workspaces w on sp.workspace_id = w.id
      where w.owner_id = auth.uid()
    )
  );

-- ── Analysis Scores ─────────────────────────────────────────
create table public.analysis_scores (
  id           uuid primary key default uuid_generate_v4(),
  analysis_id  uuid not null references public.analyses(id) on delete cascade,
  category     score_category not null,
  score        integer not null check (score between 0 and 20),
  constraint unique_analysis_category unique (analysis_id, category)
);

-- ── Analysis Findings ───────────────────────────────────────
create table public.analysis_findings (
  id           uuid primary key default uuid_generate_v4(),
  analysis_id  uuid not null references public.analyses(id) on delete cascade,
  type         finding_type not null,
  priority     priority_type,
  title        text not null,
  description  text,
  category     score_category,
  sort_order   integer default 0
);

-- ── Agents ──────────────────────────────────────────────────
create table public.agents (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  version     text not null default 'v1',
  description text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Seed agents
insert into public.agents (name, version, description) values
  ('Profile Auditor',       'v1', 'Bewertet Profilstruktur, Claim, Proof, CTA, Klarheit'),
  ('Audience & Offer Mapper','v1', 'Analysiert Zielgruppe, Kaufmotive, Einwände'),
  ('Hook Strategist',       'v1', 'Erstellt Hook-Library und bewertet Hook-Typen'),
  ('Script Writer',         'v1', 'Generiert Reels/Shorts-Skripte'),
  ('Freebie Auditor',       'v1', 'Bewertet Freebie-Relevanz und schlägt Verbesserungen vor');

-- ── Agent Runs ──────────────────────────────────────────────
create table public.agent_runs (
  id             uuid primary key default uuid_generate_v4(),
  analysis_id    uuid not null references public.analyses(id) on delete cascade,
  agent_id       uuid not null references public.agents(id),
  status         text not null default 'pending',
  tokens_used    integer,
  cost_estimate  numeric(10, 6),
  started_at     timestamptz,
  finished_at    timestamptz
);

-- ── Agent Outputs ────────────────────────────────────────────
create table public.agent_outputs (
  id            uuid primary key default uuid_generate_v4(),
  agent_run_id  uuid not null references public.agent_runs(id) on delete cascade,
  output_type   text not null,
  content       jsonb not null,
  created_at    timestamptz default now()
);

-- ── Assets ──────────────────────────────────────────────────
create table public.assets (
  id               uuid primary key default uuid_generate_v4(),
  workspace_id     uuid not null references public.workspaces(id) on delete cascade,
  social_profile_id uuid references public.social_profiles(id),
  analysis_id      uuid references public.analyses(id),
  type             asset_type not null,
  platform         platform_type,
  content          jsonb not null,
  created_at       timestamptz default now()
);

alter table public.assets enable row level security;

create policy "Workspace members can access assets"
  on public.assets for all
  using (
    workspace_id in (
      select id from public.workspaces where owner_id = auth.uid()
    )
  );

-- ── Subscriptions ───────────────────────────────────────────
create table public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  workspace_id            uuid not null references public.workspaces(id) on delete cascade,
  stripe_subscription_id  text unique,
  plan                    plan_type not null default 'free',
  status                  text not null default 'active',
  current_period_end      timestamptz,
  created_at              timestamptz default now()
);

-- ── Credits ─────────────────────────────────────────────────
create table public.credits (
  workspace_id  uuid primary key references public.workspaces(id) on delete cascade,
  balance       integer not null default 10,
  updated_at    timestamptz default now()
);

create table public.credit_transactions (
  id                  uuid primary key default uuid_generate_v4(),
  workspace_id        uuid not null references public.workspaces(id) on delete cascade,
  change_amount       integer not null,
  reason              credit_reason not null,
  related_analysis_id uuid references public.analyses(id),
  created_at          timestamptz default now()
);

-- ── Trigger: Auto-create workspace & credits on signup ──────
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_workspace_id uuid;
begin
  -- Create profile
  insert into public.profiles (id, email)
  values (new.id, new.email);

  -- Create default workspace
  insert into public.workspaces (owner_id, name)
  values (new.id, 'Mein Workspace')
  returning id into new_workspace_id;

  -- Init credits (10 free)
  insert into public.credits (workspace_id, balance)
  values (new_workspace_id, 10);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
