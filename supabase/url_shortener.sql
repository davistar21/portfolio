-- Run once in the Supabase SQL editor; safe to run again.
begin;

create table if not exists public.short_urls (
  slug text primary key check (slug ~ '^[a-z0-9][a-z0-9_-]{0,39}$'),
  destination text not null check (
    destination ~* '^https?://' and length(destination) <= 10000
    and destination !~ '[[:cntrl:]]'
  ),
  clicks bigint not null default 0 check (clicks >= 0),
  created_at timestamptz not null default now()
);

alter table public.short_urls enable row level security;
revoke all on public.short_urls from anon, authenticated;
grant select, insert, delete on public.short_urls to authenticated;

drop policy if exists short_urls_admin on public.short_urls;
create policy short_urls_admin on public.short_urls
  for all to authenticated
  using ((select auth.jwt()->>'email') = 'eyitayobembe@gmail.com')
  with check ((select auth.jwt()->>'email') = 'eyitayobembe@gmail.com');

-- Increment and resolve in one atomic update, even with concurrent visitors.
-- Only the server's service-role client may execute this function.
create or replace function public.resolve_short_url(short_slug text, count_visit boolean default true)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare target text;
begin
  if count_visit then
    update public.short_urls set clicks = clicks + 1
      where slug = short_slug returning destination into target;
  else
    select destination into target from public.short_urls where slug = short_slug;
  end if;
  return target;
end;
$$;

revoke all on function public.resolve_short_url(text, boolean) from public, anon, authenticated;
grant execute on function public.resolve_short_url(text, boolean) to service_role;
commit;
