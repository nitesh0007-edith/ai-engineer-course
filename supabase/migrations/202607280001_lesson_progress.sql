-- Personal course progress. This table deliberately stores no email address:
-- email remains inside Supabase Auth and progress is keyed by the auth user ID.
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) between 1 and 160),
  completed_items jsonb not null default '[]'::jsonb check (jsonb_typeof(completed_items) = 'array'),
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

revoke all on public.lesson_progress from anon;
grant select, insert, update, delete on public.lesson_progress to authenticated;

create policy "Learners can read their own progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Learners can add their own progress"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Learners can update their own progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Learners can delete their own progress"
  on public.lesson_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists lesson_progress_user_completed_idx
  on public.lesson_progress (user_id, completed_at desc);
