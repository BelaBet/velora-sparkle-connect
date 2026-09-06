-- O linter do Supabase marca views SECURITY DEFINER como erro (podem
-- vazar dados sem ninguém perceber). Troca por uma função SECURITY
-- DEFINER explícita, mesmo padrão já usado nas outras funções deste
-- schema — a intenção de contornar RLS fica visível no código, não
-- escondida atrás de uma view comum.

drop view if exists public.discoverable_profiles;

create or replace function public.list_discoverable_profiles()
returns table (
  id uuid,
  name text,
  age int,
  city text,
  bio text,
  interests text[],
  verified boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select id, name, age, city, bio, interests, verified
  from public.member_profiles
  where status = 'ativo';
$$;

revoke all on function public.list_discoverable_profiles() from public, anon;
grant execute on function public.list_discoverable_profiles() to authenticated;
