-- Foto de perfil via Supabase Storage. Bucket público (fotos de perfil
-- precisam ser vistas por outros membros no Descobrir), mas só o dono
-- pode escrever no próprio caminho (pasta = seu auth.uid()).

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

create policy "members upload own profile photo" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "members update own profile photo" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "members delete own profile photo" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

alter table public.member_profiles add column photo_url text;

create or replace function public.update_own_photo(p_photo_url text)
returns public.member_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.member_profiles;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;

  update public.member_profiles
  set photo_url = p_photo_url
  where user_id = auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'Perfil não encontrado para este usuário.';
  end if;

  return result;
end;
$$;

revoke all on function public.update_own_photo(text) from public, anon;
grant execute on function public.update_own_photo(text) to authenticated;

-- Descobrir também precisa devolver a foto agora
drop function public.list_discoverable_profiles();

create function public.list_discoverable_profiles()
returns table (
  id uuid,
  name text,
  age int,
  city text,
  bio text,
  interests text[],
  verified boolean,
  photo_url text
)
language sql
security definer
set search_path = public
stable
as $$
  select id, name, age, city, bio, interests, verified, photo_url
  from public.member_profiles
  where status = 'ativo';
$$;

revoke all on function public.list_discoverable_profiles() from public, anon;
grant execute on function public.list_discoverable_profiles() to authenticated;
