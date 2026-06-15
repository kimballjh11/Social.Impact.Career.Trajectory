-- Run this in your Supabase SQL editor to create the submissions table.
-- Go to: supabase.com → your project → SQL Editor → New Query → paste this → Run

create table submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text,
  career_stage  text,
  sector        text,
  sub_sector    text,
  cause_area    text,
  questionnaire_text  text,
  resume_text         text,
  power_statement     text,
  plan_306090         text,
  practitioners       text,
  organizations       text,
  resources           text,
  email_sent    boolean not null default false
);

-- Optional: only allow server-side inserts (via service role key)
alter table submissions enable row level security;

create policy "service role only"
  on submissions
  for all
  using (false);

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: inline Identity questions (added June 2026)
-- The intake now asks three questions directly when no full questionnaire is
-- uploaded. If your submissions table already exists, run just this block:

alter table submissions
  add column if not exists inline_story text,
  add column if not exists inline_come_to_you_for text,
  add column if not exists inline_lost_track_of_time text;

-- (If you are creating the table fresh, add the same three columns to the
-- create table statement above, after cause_area.)

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: output-page feedback (added June 2026)

alter table submissions
  add column if not exists feedback_rating integer,
  add column if not exists feedback_text text;

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: per-IP rate limiting for /api/generate (added June 2026)
-- Backs the per-IP rate limiter that protects /api/generate from being used
-- to burn Anthropic credits. One row per (ip, window) pair; counts reset
-- atomically when the window expires.

create table if not exists rate_limits (
  ip            text not null,
  window        text not null,
  window_start  timestamptz not null default now(),
  count         integer not null default 0,
  primary key (ip, window)
);

create index if not exists rate_limits_window_start_idx on rate_limits (window_start);

alter table rate_limits enable row level security;

-- Server-only access (service role bypasses RLS); no anon policy.
drop policy if exists "service role only" on rate_limits;
create policy "service role only"
  on rate_limits
  for all
  using (false);

-- Atomic check + increment in a single round trip. Resets count to 1 when
-- the window expires; otherwise increments. Returns whether the post-
-- increment count is still within the limit, plus seconds until reset.
create or replace function check_rate_limit(
  p_ip text,
  p_window text,
  p_max_count int,
  p_window_seconds int
) returns table(allowed boolean, current_count int, retry_after int)
language plpgsql as $$
declare
  v_count int;
  v_window_start timestamptz;
begin
  insert into rate_limits (ip, window, window_start, count)
  values (p_ip, p_window, now(), 1)
  on conflict (ip, window) do update set
    count = case
      when now() - rate_limits.window_start >= make_interval(secs => p_window_seconds) then 1
      else rate_limits.count + 1
    end,
    window_start = case
      when now() - rate_limits.window_start >= make_interval(secs => p_window_seconds) then now()
      else rate_limits.window_start
    end
  returning rate_limits.count, rate_limits.window_start
  into v_count, v_window_start;

  return query select
    (v_count <= p_max_count) as allowed,
    v_count as current_count,
    greatest(0, p_window_seconds - extract(epoch from (now() - v_window_start))::int) as retry_after;
end;
$$;
