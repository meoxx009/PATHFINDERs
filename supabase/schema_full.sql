-- ====================================================================
-- SkillForge AI — Complete Master Supabase Schema
-- Single idempotent script for all tables, columns, indexes, RLS, and triggers.
-- Run this in the Supabase Dashboard -> SQL Editor -> New Query -> Run.
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  full_name text,
  email text,
  target_role text default 'frontend',
  experience_level text default 'beginner',
  hours_per_week integer default 6,
  goal_days integer default 14,
  university text,
  graduation_year text,
  current_semester text,
  degree text,
  engineering_branch text,
  stream text,
  specialization text,
  learning_style text,
  roadmap_intensity text,
  preferred_industry text,
  work_mode text,
  location_preference text,
  career_goal_type text,
  extended_profile jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Ensure all extended columns exist if table was already created
alter table if exists public.profiles
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists university text,
  add column if not exists graduation_year text,
  add column if not exists current_semester text,
  add column if not exists degree text,
  add column if not exists engineering_branch text,
  add column if not exists stream text,
  add column if not exists specialization text,
  add column if not exists learning_style text,
  add column if not exists roadmap_intensity text,
  add column if not exists preferred_industry text,
  add column if not exists work_mode text,
  add column if not exists location_preference text,
  add column if not exists career_goal_type text,
  add column if not exists extended_profile jsonb default '{}'::jsonb;

-- --------------------------------------------------------------------
-- 2. RESUMES TABLE
-- --------------------------------------------------------------------
create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'My Resume',
  source_type text default 'paste', -- 'paste' | 'upload'
  raw_text text not null,
  target_role text,
  experience_level text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table if exists public.resumes
  add column if not exists target_role text,
  add column if not exists experience_level text;

-- --------------------------------------------------------------------
-- 3. RESUME ANALYSES TABLE
-- --------------------------------------------------------------------
create table if not exists public.resume_analyses (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references public.resumes(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade not null,
  model_provider text default 'demo',
  model_name text,
  status text default 'completed',
  analysis_json jsonb not null,
  error_message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------------
-- 4. LEARNING PATHS TABLE
-- --------------------------------------------------------------------
create table if not exists public.learning_paths (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_analysis_id uuid references public.resume_analyses(id) on delete set null,
  target_role text not null,
  goal text not null default 'Career Readiness',
  duration_days integer not null default 14,
  goal_days integer default 14,
  hours_per_week integer not null default 6,
  weekly_hours integer default 6,
  status text default 'active',
  path_json jsonb not null default '{}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table if exists public.learning_paths
  add column if not exists weekly_hours integer default 6,
  add column if not exists goal_days integer default 14;

-- --------------------------------------------------------------------
-- 5. LEARNING TASKS TABLE
-- --------------------------------------------------------------------
create table if not exists public.learning_tasks (
  id uuid primary key default uuid_generate_v4(),
  learning_path_id uuid references public.learning_paths(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  skill text not null,
  reason text not null,
  description text,
  estimated_minutes integer not null default 60,
  priority text default 'medium',
  expected_outcome text,
  source text default 'skill_gap', -- 'skill_gap' | 'interview_feedback' | 'user_goal'
  status text default 'todo',       -- 'todo' | 'in_progress' | 'completed'
  order_index integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------------
-- 6. INTERVIEW SESSIONS TABLE
-- --------------------------------------------------------------------
create table if not exists public.interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  target_role text not null,
  status text default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------------
-- 7. INTERVIEW QUESTIONS TABLE
-- --------------------------------------------------------------------
create table if not exists public.interview_questions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.interview_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  question text not null,
  question_type text default 'technical', -- 'behavioral' | 'technical' | 'project'
  difficulty text default 'beginner',     -- 'beginner' | 'intermediate' | 'advanced'
  tested_skills jsonb not null default '[]'::jsonb,
  answer_framework text default 'STAR',
  order_index integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------------
-- 8. INTERVIEW ANSWERS TABLE
-- --------------------------------------------------------------------
create table if not exists public.interview_answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.interview_questions(id) on delete cascade not null,
  session_id uuid references public.interview_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  answer_text text not null,
  evaluation_json jsonb not null default '{}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- --------------------------------------------------------------------
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resume_analyses_user_id on public.resume_analyses(user_id);
create index if not exists idx_learning_paths_user_id on public.learning_paths(user_id);
create index if not exists idx_learning_tasks_path_id on public.learning_tasks(learning_path_id);
create index if not exists idx_learning_tasks_user_id on public.learning_tasks(user_id);
create index if not exists idx_interview_sessions_user_id on public.interview_sessions(user_id);
create index if not exists idx_interview_questions_session_id on public.interview_questions(session_id);
create index if not exists idx_interview_answers_session_id on public.interview_answers(session_id);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Profiles RLS
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Resumes RLS
alter table public.resumes enable row level security;
drop policy if exists "Users can view own resumes" on public.resumes;
create policy "Users can view own resumes" on public.resumes
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own resumes" on public.resumes;
create policy "Users can insert own resumes" on public.resumes
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own resumes" on public.resumes;
create policy "Users can update own resumes" on public.resumes
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own resumes" on public.resumes;
create policy "Users can delete own resumes" on public.resumes
  for delete using (auth.uid() = user_id);

-- Resume Analyses RLS
alter table public.resume_analyses enable row level security;
drop policy if exists "Users can view own analyses" on public.resume_analyses;
create policy "Users can view own analyses" on public.resume_analyses
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own analyses" on public.resume_analyses;
create policy "Users can insert own analyses" on public.resume_analyses
  for insert with check (auth.uid() = user_id);

-- Learning Paths RLS
alter table public.learning_paths enable row level security;
drop policy if exists "Users can view own paths" on public.learning_paths;
create policy "Users can view own paths" on public.learning_paths
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own paths" on public.learning_paths;
create policy "Users can insert own paths" on public.learning_paths
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own paths" on public.learning_paths;
create policy "Users can update own paths" on public.learning_paths
  for update using (auth.uid() = user_id);

-- Learning Tasks RLS
alter table public.learning_tasks enable row level security;
drop policy if exists "Users can view own tasks" on public.learning_tasks;
create policy "Users can view own tasks" on public.learning_tasks
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tasks" on public.learning_tasks;
create policy "Users can insert own tasks" on public.learning_tasks
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own tasks" on public.learning_tasks;
create policy "Users can update own tasks" on public.learning_tasks
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own tasks" on public.learning_tasks;
create policy "Users can delete own tasks" on public.learning_tasks
  for delete using (auth.uid() = user_id);

-- Interview Sessions RLS
alter table public.interview_sessions enable row level security;
drop policy if exists "Users can view own sessions" on public.interview_sessions;
create policy "Users can view own sessions" on public.interview_sessions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own sessions" on public.interview_sessions;
create policy "Users can insert own sessions" on public.interview_sessions
  for insert with check (auth.uid() = user_id);

-- Interview Questions RLS
alter table public.interview_questions enable row level security;
drop policy if exists "Users can view own questions" on public.interview_questions;
create policy "Users can view own questions" on public.interview_questions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own questions" on public.interview_questions;
create policy "Users can insert own questions" on public.interview_questions
  for insert with check (auth.uid() = user_id);

-- Interview Answers RLS
alter table public.interview_answers enable row level security;
drop policy if exists "Users can view own answers" on public.interview_answers;
create policy "Users can view own answers" on public.interview_answers
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own answers" on public.interview_answers;
create policy "Users can insert own answers" on public.interview_answers
  for insert with check (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- AUTH HOOK TRIGGER: Automatic Profile Creation on Signup
-- --------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, email, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
