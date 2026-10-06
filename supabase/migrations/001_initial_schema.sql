-- ====================================================================
-- SHIFT / 01 — Supabase Initial Schema & RLS Policies (Migration 001)
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_role text default 'frontend',
  experience_level text default 'beginner',
  hours_per_week integer default 6,
  goal_days integer default 14,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. RESUMES TABLE
create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'My Resume',
  source_type text default 'paste', -- 'paste' or 'upload'
  raw_text text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. RESUME ANALYSES TABLE
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

-- 4. LEARNING PATHS TABLE
create table if not exists public.learning_paths (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_analysis_id uuid references public.resume_analyses(id) on delete set null,
  target_role text not null,
  goal text not null,
  duration_days integer not null,
  hours_per_week integer not null,
  status text default 'active',
  path_json jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. LEARNING TASKS TABLE
create table if not exists public.learning_tasks (
  id uuid primary key default uuid_generate_v4(),
  learning_path_id uuid references public.learning_paths(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  skill text not null,
  reason text not null,
  description text,
  estimated_minutes integer not null,
  priority text default 'medium',
  expected_outcome text,
  source text default 'skill_gap', -- 'skill_gap' | 'interview_feedback' | 'user_goal'
  status text default 'todo',       -- 'todo' | 'in_progress' | 'completed'
  order_index integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. INTERVIEW SESSIONS TABLE
create table if not exists public.interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  target_role text not null,
  status text default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. INTERVIEW QUESTIONS TABLE
create table if not exists public.interview_questions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.interview_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  question text not null,
  question_type text default 'technical', -- 'behavioral' | 'technical' | 'project'
  difficulty text default 'beginner',     -- 'beginner' | 'intermediate' | 'advanced'
  tested_skills jsonb not null,
  answer_framework text default 'STAR',
  order_index integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 8. INTERVIEW ANSWERS TABLE
create table if not exists public.interview_answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.interview_questions(id) on delete cascade not null,
  session_id uuid references public.interview_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  answer_text text not null,
  evaluation_json jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Profiles RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Resumes RLS
alter table public.resumes enable row level security;
create policy "Users can view own resumes" on public.resumes
  for select using (auth.uid() = user_id);
create policy "Users can insert own resumes" on public.resumes
  for insert with check (auth.uid() = user_id);
create policy "Users can update own resumes" on public.resumes
  for update using (auth.uid() = user_id);
create policy "Users can delete own resumes" on public.resumes
  for delete using (auth.uid() = user_id);

-- Resume Analyses RLS
alter table public.resume_analyses enable row level security;
create policy "Users can view own analyses" on public.resume_analyses
  for select using (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.resume_analyses
  for insert with check (auth.uid() = user_id);

-- Learning Paths RLS
alter table public.learning_paths enable row level security;
create policy "Users can view own paths" on public.learning_paths
  for select using (auth.uid() = user_id);
create policy "Users can insert own paths" on public.learning_paths
  for insert with check (auth.uid() = user_id);
create policy "Users can update own paths" on public.learning_paths
  for update using (auth.uid() = user_id);

-- Learning Tasks RLS
alter table public.learning_tasks enable row level security;
create policy "Users can view own tasks" on public.learning_tasks
  for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.learning_tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.learning_tasks
  for update using (auth.uid() = user_id);

-- Interview Sessions RLS
alter table public.interview_sessions enable row level security;
create policy "Users can view own sessions" on public.interview_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.interview_sessions
  for insert with check (auth.uid() = user_id);

-- Interview Questions RLS
alter table public.interview_questions enable row level security;
create policy "Users can view own questions" on public.interview_questions
  for select using (auth.uid() = user_id);
create policy "Users can insert own questions" on public.interview_questions
  for insert with check (auth.uid() = user_id);

-- Interview Answers RLS
alter table public.interview_answers enable row level security;
create policy "Users can view own answers" on public.interview_answers
  for select using (auth.uid() = user_id);
create policy "Users can insert own answers" on public.interview_answers
  for insert with check (auth.uid() = user_id);
