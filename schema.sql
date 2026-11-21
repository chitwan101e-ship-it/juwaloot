-- Do not run this file.
-- The only database script for JuwaLoot is supabase/schema.sql.
do $$
begin
  raise exception 'Wrong file. In the Supabase SQL editor, run supabase/schema.sql. If a previous run failed, run supabase/migrations/000_reset_app_schema.sql first.';
end $$;
