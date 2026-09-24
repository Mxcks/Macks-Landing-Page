-- Macks Studios public website: discovery guide submissions.
--
-- One row per deliberate "Send my answers" action on https://macksstudios.org/#guide.
-- Anonymous visitors may INSERT only. They cannot read, list, update, or delete rows.
-- Rows are read by Macks staff through the Supabase dashboard (table owner / service role).
--
-- The allowed answer values are the exact option values in public/index.html for guide
-- version 2026-09-23. Changing a question or option on the page requires a new migration
-- that bumps guide_version and extends these checks; old rows keep their original values.
--
-- Deliberately NOT collected: name, email, phone, business name, IP address, user agent,
-- cookies, analytics or tracking identifiers. See docs/development/guide-submissions.md.

create table public.guide_submissions (
  -- Generated in the browser once per distinct answer set, so a retry after a lost
  -- response cannot create a second row. Not stored in the browser; not a visitor id.
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guide_version text not null
    check (guide_version in ('2026-09-23')),
  source text not null
    check (source in ('landing-page-guide')),

  -- Q1 "Which of these sounds most like your business right now?"
  situation text not null check (situation in (
    'Follow-up depends on my memory',
    'Invoices need chasing',
    'Documents are spread across tools',
    'My tools do not connect to each other',
    'The same admin repeats for every client',
    'Too much lives in one person''s head'
  )),
  -- Q2 "Where does it cost you the most?"
  friction text not null check (friction in (
    'Getting inquiries and bookings in',
    'Proposals and agreements',
    'Getting paid',
    'Delivering the work and following up'
  )),
  -- Q3 "What do you already have?"
  starting text not null check (starting in (
    'A website that mostly works',
    'A website that needs rework',
    'No website yet, just tools and documents',
    'Not sure where I stand'
  )),
  -- Q4 "What would be most useful from a first conversation?"
  help text not null check (help in (
    'A clearer picture of what to do first',
    'Someone to build the connected pieces',
    'An outside view of how the business runs'
  )),
  -- "Anything else worth knowing? (optional)". Empty notes are sent as null.
  notes text check (notes is null or char_length(notes) between 1 and 2000)
);

comment on table public.guide_submissions is
  'Answers a visitor chose to send from the public discovery guide. Anonymous insert-only; no contact details.';

create index guide_submissions_created_at_idx on public.guide_submissions (created_at desc);

-- Row Level Security: on, with exactly one policy (anonymous insert).
alter table public.guide_submissions enable row level security;

-- Supabase grants ALL on new public tables to anon and authenticated by default.
-- Remove that, then grant back only INSERT on the columns a visitor supplies.
-- created_at is always server-set; there is no SELECT, UPDATE, DELETE, or TRUNCATE.
revoke all on table public.guide_submissions from public, anon, authenticated;
grant insert (id, guide_version, source, situation, friction, starting, help, notes)
  on table public.guide_submissions to anon;

-- Content is validated by the column checks above; the policy only scopes the role.
create policy "Anonymous visitors can send guide answers"
  on public.guide_submissions
  for insert
  to anon
  with check (true);
