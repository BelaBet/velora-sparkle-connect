-- Permite que o Descobrir mostre perfis reais (cadastrados de verdade),
-- sem expor colunas sensíveis (email, status, reports_count, user_id) a
-- outros membros: a view só devolve o que é seguro mostrar publicamente.

alter table public.member_profiles add column bio text;
alter table public.member_profiles add column interests text[] not null default '{}';

create view public.discoverable_profiles as
  select id, name, age, city, bio, interests, verified
  from public.member_profiles
  where status = 'ativo';

grant select on public.discoverable_profiles to authenticated;

-- Membro edita apenas a própria bio/interesses — nunca status/verified/etc.
create or replace function public.update_own_profile_details(p_bio text, p_interests text[])
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
  set bio = p_bio, interests = p_interests
  where user_id = auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'Perfil não encontrado para este usuário.';
  end if;

  return result;
end;
$$;

revoke all on function public.update_own_profile_details(text, text[]) from public, anon;
grant execute on function public.update_own_profile_details(text, text[]) to authenticated;
