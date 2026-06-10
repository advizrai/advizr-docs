-- Docs feedback table (master Supabase instance: slfuyusnydijbqwxfbtq)
-- Run once: supabase db push, or paste into the SQL editor.
create table if not exists public.docs_feedback (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  vote text not null check (vote in ('up', 'down')),
  reason text,
  created_at timestamptz not null default now()
);

-- Service-role inserts only; no anon access.
alter table public.docs_feedback enable row level security;

create index if not exists docs_feedback_page_idx on public.docs_feedback (page);
create index if not exists docs_feedback_created_idx on public.docs_feedback (created_at desc);
