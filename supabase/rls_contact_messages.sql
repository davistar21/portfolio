-- ============================================================================
-- contact_messages — Row Level Security
-- ============================================================================
-- Goal: stop anonymous browsers from writing rows directly with the public
-- anon key. Submissions must go through /api/contact, which uses the secret
-- SUPABASE_SERVICE_ROLE_KEY (the service role bypasses RLS).
--
-- How to run: open Supabase Dashboard → SQL Editor → paste → Run.
-- Safe to re-run.
-- ============================================================================


-- 1. Enable RLS on the table.
alter table public.contact_messages enable row level security;


-- 2. Inspect existing policies first so you know what's actually there.
--    Uncomment, run, then re-comment.
--
-- select policyname, cmd, roles, qual, with_check
--   from pg_policies
--  where schemaname = 'public' and tablename = 'contact_messages';


-- 3. Drop any policy that currently allows anon/public to INSERT.
--    These are the common default names Supabase / starter templates create.
--    Replace / add to this list based on what step 2 showed you.
drop policy if exists "Enable insert for anon"        on public.contact_messages;
drop policy if exists "Enable insert for anon users"  on public.contact_messages;
drop policy if exists "Enable insert for everyone"    on public.contact_messages;
drop policy if exists "Allow public insert"           on public.contact_messages;
drop policy if exists "Allow anonymous insert"        on public.contact_messages;
drop policy if exists "Insert for all"                on public.contact_messages;


-- 4. Keep the admin panel working.
--    components/admin/ContactManager.tsx currently reads + updates via the
--    public anon client. Until that's moved behind a server route using the
--    service-role key, allow anon SELECT + UPDATE so the admin doesn't break.
--
--    ⚠ TRADE-OFF: this means anyone with the anon key (shipped in the browser
--    bundle) can READ every contact message via Supabase's REST API. The
--    important attack — anonymous INSERT — is blocked, but message contents
--    are technically readable. To close that gap, see section 6 below.
drop policy if exists "contact_messages_anon_select" on public.contact_messages;
create policy "contact_messages_anon_select"
  on public.contact_messages
  for select
  to anon
  using (true);

drop policy if exists "contact_messages_anon_update" on public.contact_messages;
create policy "contact_messages_anon_update"
  on public.contact_messages
  for update
  to anon
  using (true)
  with check (true);


-- 5. Sanity check — should list only SELECT + UPDATE policies for `anon`.
--    No INSERT policy = anon cannot insert. service_role bypasses RLS, so
--    /api/contact still works.
--
-- select policyname, cmd, roles
--   from pg_policies
--  where schemaname = 'public' and tablename = 'contact_messages'
--  order by cmd;


-- ============================================================================
-- 6. (Optional, stricter) Lock reads/updates to signed-in admins only.
-- ============================================================================
-- Run this AFTER you have the admin authenticate via Supabase Auth (or move
-- admin reads to a server route using the service-role key). It revokes the
-- anon SELECT/UPDATE policies above and replaces them with `authenticated`-
-- role policies, so only signed-in users can read or update messages.
--
-- drop policy if exists "contact_messages_anon_select" on public.contact_messages;
-- drop policy if exists "contact_messages_anon_update" on public.contact_messages;
--
-- create policy "contact_messages_auth_select"
--   on public.contact_messages
--   for select
--   to authenticated
--   using (true);
--
-- create policy "contact_messages_auth_update"
--   on public.contact_messages
--   for update
--   to authenticated
--   using (true)
--   with check (true);
