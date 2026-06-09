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
