-- Liga perfis de membro a contas reais do Supabase Auth (cadastro/login da Velora),
-- mantendo o painel admin como única via de aprovação de status/verificação.

alter table public.member_profiles
  add column user_id uuid unique references auth.users(id) on delete cascade;

-- Membros podem ver o próprio perfil (além do acesso total que admins já têm)
create policy "members can view own profile" on public.member_profiles
  for select using (user_id = auth.uid());

-- Membros podem ver as próprias solicitações de verificação
create policy "members can view own verification requests" on public.verification_requests
  for select using (
    exists (
      select 1 from public.member_profiles mp
      where mp.id = verification_requests.profile_id
        and mp.user_id = auth.uid()
    )
  );

-- Cria o perfil do membro logo após o cadastro. SECURITY DEFINER para não
-- precisar abrir INSERT direto em member_profiles para o cliente: o membro
-- nunca escreve status/verified diretamente, só via esta função, sempre
-- com os valores seguros abaixo.
create or replace function public.complete_signup_profile(p_name text, p_age int, p_city text)
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

  if exists (select 1 from public.member_profiles where user_id = auth.uid()) then
    raise exception 'Perfil já existe para este usuário.';
  end if;

  insert into public.member_profiles (user_id, name, age, email, city, status, verified, reports_count)
  values (auth.uid(), p_name, p_age, (select email from auth.users where id = auth.uid()), p_city, 'pendente', false, 0)
  returning * into result;

  return result;
end;
$$;

revoke all on function public.complete_signup_profile(text, int, text) from public, anon;
grant execute on function public.complete_signup_profile(text, int, text) to authenticated;

-- Registra um pedido de verificação para o perfil do próprio chamador.
-- Também SECURITY DEFINER: o membro não recebe INSERT direto em
-- verification_requests (evita forjar profile_id/profile_name/status).
create or replace function public.request_identity_verification(p_type text default 'identidade')
returns public.verification_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_profile public.member_profiles;
  result public.verification_requests;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;

  select * into caller_profile from public.member_profiles where user_id = auth.uid();
  if caller_profile.id is null then
    raise exception 'Perfil não encontrado para este usuário.';
  end if;

  insert into public.verification_requests (profile_id, profile_name, type, status)
  values (caller_profile.id, caller_profile.name, p_type, 'pendente')
  returning * into result;

  return result;
end;
$$;

revoke all on function public.request_identity_verification(text) from public, anon;
grant execute on function public.request_identity_verification(text) to authenticated;
