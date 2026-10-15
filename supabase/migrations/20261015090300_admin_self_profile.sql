-- Lets a signed-in platform administrator change their OWN display name from Settings -> Profile.
-- Lives in the `core` schema, next to the table it changes (core.platform_admins).
--
-- Why a function and not a plain UPDATE policy?
--   A policy on core.platform_admins would also let an admin rewrite their `role` column.
--   This function can only ever touch `full_name`, and only on the caller's own row.

create or replace function core.update_own_admin_profile(new_full_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  cleaned text := btrim(new_full_name);
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;

  if cleaned is null or char_length(cleaned) < 2 or char_length(cleaned) > 80 then
    raise exception 'Name must be between 2 and 80 characters' using errcode = '22023';
  end if;

  update core.platform_admins
     set full_name = cleaned
   where user_id = auth.uid();

  if not found then
    raise exception 'Only platform administrators can edit this profile' using errcode = '42501';
  end if;

  return cleaned;
end;
$$;

revoke all on function core.update_own_admin_profile(text) from public, anon;
grant execute on function core.update_own_admin_profile(text) to authenticated;