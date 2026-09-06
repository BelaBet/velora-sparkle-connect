-- Bloqueio e denúncia reais entre membros. Antes disso, os botões em
-- /seguranca só mostravam um toast — nada era gravado, e um perfil
-- bloqueado continuava aparecendo em descoberta, matches e mensagens.

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_profile_id uuid not null references public.member_profiles(id) on delete cascade,
  blocked_profile_id uuid not null references public.member_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_profile_id, blocked_profile_id),
  check (blocker_profile_id <> blocked_profile_id)
);

alter table public.blocks enable row level security;

create policy "members manage own blocks" on public.blocks
  for all using (blocker_profile_id = public.own_profile_id())
  with check (blocker_profile_id = public.own_profile_id());

create policy "admins read all blocks" on public.blocks
  for select using (public.is_admin());

-- security_reports até aqui só tinha os campos de nome usados pelos dados
-- de exemplo do painel admin. Adiciona referências reais aos perfis para
-- denúncias enviadas pelo próprio app.
alter table public.security_reports
  add column reporter_profile_id uuid references public.member_profiles(id) on delete set null,
  add column reported_profile_id uuid references public.member_profiles(id) on delete set null;

-- Bloqueia o perfil alvo. Idempotente — bloquear de novo não dá erro.
create or replace function public.block_profile(p_target_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;
  if p_target_profile_id = my_id then
    raise exception 'Não é possível bloquear o próprio perfil.';
  end if;

  insert into public.blocks (blocker_profile_id, blocked_profile_id)
  values (my_id, p_target_profile_id)
  on conflict (blocker_profile_id, blocked_profile_id) do nothing;
end;
$$;

revoke all on function public.block_profile(uuid) from public, anon;
grant execute on function public.block_profile(uuid) to authenticated;

-- Desfaz um bloqueio próprio.
create or replace function public.unblock_profile(p_target_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;

  delete from public.blocks
  where blocker_profile_id = my_id and blocked_profile_id = p_target_profile_id;
end;
$$;

revoke all on function public.unblock_profile(uuid) from public, anon;
grant execute on function public.unblock_profile(uuid) to authenticated;

-- Denuncia um perfil. Severidade fica 'média' por padrão — a equipe
-- reclassifica no painel admin depois de analisar.
create or replace function public.submit_security_report(
  p_reported_profile_id uuid,
  p_reason text,
  p_details text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
  my_name text;
  target_name text;
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;
  if trim(p_reason) = '' then
    raise exception 'Motivo da denúncia é obrigatório.';
  end if;

  select name into my_name from public.member_profiles where id = my_id;
  select name into target_name from public.member_profiles where id = p_reported_profile_id;

  if target_name is null then
    raise exception 'Perfil denunciado não encontrado.';
  end if;

  insert into public.security_reports (
    reporter_profile_id, reported_profile_id, reporter_name, reported_name,
    reason, details, severity, status
  ) values (
    my_id, p_reported_profile_id, my_name, target_name,
    p_reason, coalesce(nullif(trim(p_details), ''), 'Sem detalhes adicionais.'), 'média', 'aberto'
  );

  update public.member_profiles
    set reports_count = reports_count + 1
    where id = p_reported_profile_id;
end;
$$;

revoke all on function public.submit_security_report(uuid, text, text) from public, anon;
grant execute on function public.submit_security_report(uuid, text, text) to authenticated;

-- Descoberta agora exclui quem bloqueou o chamador ou foi bloqueado por ele.
-- (drop necessário porque o Postgres não deixa trocar o tipo de retorno
-- de uma função table-returning via CREATE OR REPLACE.)
drop function if exists public.list_discoverable_profiles();

create function public.list_discoverable_profiles()
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
  select p.id, p.name, p.age, p.city, p.bio, p.interests, p.verified
  from public.member_profiles p
  where p.status = 'ativo'
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_profile_id = public.own_profile_id() and b.blocked_profile_id = p.id)
         or (b.blocker_profile_id = p.id and b.blocked_profile_id = public.own_profile_id())
    );
$$;

revoke all on function public.list_discoverable_profiles() from public, anon;
grant execute on function public.list_discoverable_profiles() to authenticated;

-- Matches com um perfil bloqueado (em qualquer direção) somem da lista.
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
  where (m.profile_one_id = public.own_profile_id() or m.profile_two_id = public.own_profile_id())
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_profile_id = public.own_profile_id() and b.blocked_profile_id = p.id)
         or (b.blocker_profile_id = p.id and b.blocked_profile_id = public.own_profile_id())
    )
  order by m.created_at desc;
$$;

-- Interesse não pode ser expresso entre perfis com bloqueio em qualquer direção.
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
  if exists (
    select 1 from public.blocks
    where (blocker_profile_id = my_id and blocked_profile_id = p_to_profile_id)
       or (blocker_profile_id = p_to_profile_id and blocked_profile_id = my_id)
  ) then
    raise exception 'Não é possível interagir com esse perfil.';
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

-- Mensagens param de ser entregues assim que um dos dois bloqueia o outro.
create or replace function public.send_message(p_match_id uuid, p_text text)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  my_id uuid := public.own_profile_id();
  other_id uuid;
  result public.messages;
begin
  if my_id is null then
    raise exception 'Perfil não encontrado.';
  end if;

  if trim(p_text) = '' then
    raise exception 'Mensagem vazia.';
  end if;

  select case when profile_one_id = my_id then profile_two_id else profile_one_id end
    into other_id
  from public.matches
  where id = p_match_id and (profile_one_id = my_id or profile_two_id = my_id);

  if other_id is null then
    raise exception 'Você não faz parte dessa conversa.';
  end if;

  if exists (
    select 1 from public.blocks
    where (blocker_profile_id = my_id and blocked_profile_id = other_id)
       or (blocker_profile_id = other_id and blocked_profile_id = my_id)
  ) then
    raise exception 'Não é possível enviar mensagens nessa conversa.';
  end if;

  insert into public.messages (match_id, sender_profile_id, text)
  values (p_match_id, my_id, p_text)
  returning * into result;

  return result;
end;
$$;
