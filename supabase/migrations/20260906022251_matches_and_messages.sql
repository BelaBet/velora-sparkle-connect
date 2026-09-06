-- Interesse recíproco vira conexão (match); conversa real entre pares
-- que deram match. Nada disso é visível fora do próprio par.

create or replace function public.own_profile_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.member_profiles where user_id = auth.uid();
$$;

revoke all on function public.own_profile_id() from public, anon;
grant execute on function public.own_profile_id() to authenticated;

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.member_profiles(id) on delete cascade,
  to_profile_id uuid not null references public.member_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id),
  check (from_profile_id <> to_profile_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  profile_one_id uuid not null references public.member_profiles(id) on delete cascade,
  profile_two_id uuid not null references public.member_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_one_id, profile_two_id),
  check (profile_one_id < profile_two_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_profile_id uuid not null references public.member_profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

create policy "members view own outgoing likes" on public.likes
  for select using (from_profile_id = public.own_profile_id());

create policy "members view own matches" on public.matches
  for select using (
    profile_one_id = public.own_profile_id() or profile_two_id = public.own_profile_id()
  );

create policy "members view messages in own matches" on public.messages
  for select using (
    exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and (m.profile_one_id = public.own_profile_id() or m.profile_two_id = public.own_profile_id())
    )
  );

-- Registra o interesse do chamador; se já havia interesse recíproco, cria o match.
create or replace function public.express_interest(p_to_profile_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
  reverse_exists boolean;
  found_match_id uuid;
  lo uuid;
  hi uuid;
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;
  if p_to_profile_id = my_id then
    raise exception 'Não é possível demonstrar interesse no próprio perfil.';
  end if;

  insert into public.likes (from_profile_id, to_profile_id)
  values (my_id, p_to_profile_id)
  on conflict (from_profile_id, to_profile_id) do nothing;

  select exists (
    select 1 from public.likes where from_profile_id = p_to_profile_id and to_profile_id = my_id
  ) into reverse_exists;

  if reverse_exists then
    lo := least(my_id, p_to_profile_id);
    hi := greatest(my_id, p_to_profile_id);

    insert into public.matches (profile_one_id, profile_two_id)
    values (lo, hi)
    on conflict (profile_one_id, profile_two_id) do nothing;

    select id into found_match_id from public.matches where profile_one_id = lo and profile_two_id = hi;

    return jsonb_build_object('matched', true, 'match_id', found_match_id);
  end if;

  return jsonb_build_object('matched', false);
end;
$$;

revoke all on function public.express_interest(uuid) from public, anon;
grant execute on function public.express_interest(uuid) to authenticated;

-- Lista os matches do chamador já com os dados públicos do outro par.
create or replace function public.list_my_matches()
returns table (
  match_id uuid,
  profile_id uuid,
  name text,
  age int,
  city text,
  photo_url text,
  matched_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    m.id as match_id,
    p.id as profile_id,
    p.name,
    p.age,
    p.city,
    p.photo_url,
    m.created_at as matched_at
  from public.matches m
  join public.member_profiles p
    on p.id = case
      when m.profile_one_id = public.own_profile_id() then m.profile_two_id
      else m.profile_one_id
    end
  where m.profile_one_id = public.own_profile_id() or m.profile_two_id = public.own_profile_id()
  order by m.created_at desc;
$$;

revoke all on function public.list_my_matches() from public, anon;
grant execute on function public.list_my_matches() to authenticated;

-- Envia mensagem, validando que o chamador realmente faz parte do match.
create or replace function public.send_message(p_match_id uuid, p_text text)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
  result public.messages;
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;

  if trim(p_text) = '' then
    raise exception 'Mensagem vazia.';
  end if;

  if not exists (
    select 1 from public.matches
    where id = p_match_id and (profile_one_id = my_id or profile_two_id = my_id)
  ) then
    raise exception 'Você não faz parte dessa conversa.';
  end if;

  insert into public.messages (match_id, sender_profile_id, text)
  values (p_match_id, my_id, p_text)
  returning * into result;

  return result;
end;
$$;

revoke all on function public.send_message(uuid, text) from public, anon;
grant execute on function public.send_message(uuid, text) to authenticated;
