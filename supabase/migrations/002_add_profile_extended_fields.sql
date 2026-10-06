-- ====================================================================
-- SkillForge AI — Supabase Migration 002: Extended Profile & System Fields
-- ====================================================================

-- 1. Extended Profile Fields
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

-- 2. Extended Resumes Fields (for role & level indexing)
alter table if exists public.resumes
  add column if not exists target_role text,
  add column if not exists experience_level text;

-- 3. Extended Learning Paths Fields (for column compatibility)
alter table if exists public.learning_paths
  add column if not exists weekly_hours integer default 6,
  add column if not exists goal_days integer default 14;

-- 4. Performance Indexes
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resume_analyses_user_id on public.resume_analyses(user_id);
create index if not exists idx_learning_paths_user_id on public.learning_paths(user_id);
create index if not exists idx_learning_tasks_path_id on public.learning_tasks(learning_path_id);
create index if not exists idx_learning_tasks_user_id on public.learning_tasks(user_id);
create index if not exists idx_interview_sessions_user_id on public.interview_sessions(user_id);
create index if not exists idx_interview_questions_session_id on public.interview_questions(session_id);
create index if not exists idx_interview_answers_session_id on public.interview_answers(session_id);

-- 5. Automatic Profile Creation Trigger on Supabase Auth Signup
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
