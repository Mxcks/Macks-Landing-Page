-- Verifies the guide_submissions permission model. Safe on production: everything runs
-- in one transaction that is rolled back, so no test row is kept.
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/guide_submissions_security.sql
--
-- Prints "guide_submissions security: all checks passed" or stops at the first failure.

begin;

do $$
declare
  denied boolean;
begin
  -- RLS on, exactly one policy: INSERT for anon.
  if not (select relrowsecurity from pg_class where oid = 'public.guide_submissions'::regclass) then
    raise exception 'RLS is not enabled';
  end if;
  if (select count(*) from pg_policies where schemaname = 'public' and tablename = 'guide_submissions') <> 1
     or not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'guide_submissions'
                    and cmd = 'INSERT' and roles = '{anon}') then
    raise exception 'unexpected policies on guide_submissions';
  end if;

  -- anon / authenticated table-level privileges: none. anon column privileges: INSERT only.
  if exists (select 1 from information_schema.role_table_grants
             where table_schema = 'public' and table_name = 'guide_submissions'
               and grantee in ('anon', 'authenticated', 'PUBLIC')) then
    raise exception 'anon/authenticated/PUBLIC hold table-level privileges';
  end if;
  if exists (select 1 from information_schema.column_privileges
             where table_schema = 'public' and table_name = 'guide_submissions'
               and grantee in ('anon', 'authenticated', 'PUBLIC')
               and not (grantee = 'anon' and privilege_type = 'INSERT' and column_name <> 'created_at')) then
    raise exception 'unexpected column privileges';
  end if;
end $$;

set local role anon;

insert into public.guide_submissions (guide_version, source, situation, friction, starting, help)
values ('2026-09-23', 'landing-page-guide', 'Invoices need chasing', 'Getting paid',
        'Not sure where I stand', 'A clearer picture of what to do first');

do $$
begin
  begin perform 1 from public.guide_submissions; raise exception 'anon could SELECT';
  exception when insufficient_privilege then null; end;
  begin update public.guide_submissions set notes = 'x'; raise exception 'anon could UPDATE';
  exception when insufficient_privilege then null; end;
  begin delete from public.guide_submissions; raise exception 'anon could DELETE';
  exception when insufficient_privilege then null; end;
  begin insert into public.guide_submissions (guide_version, source, situation, friction, starting, help)
        values ('2026-09-23', 'landing-page-guide', 'not an option', 'Getting paid',
                'Not sure where I stand', 'A clearer picture of what to do first');
        raise exception 'anon could insert an unknown answer';
  exception when check_violation then null; end;
end $$;

reset role;
set local role authenticated;

do $$
begin
  begin perform 1 from public.guide_submissions; raise exception 'authenticated could SELECT';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select 'guide_submissions security: all checks passed' as result;

rollback;
