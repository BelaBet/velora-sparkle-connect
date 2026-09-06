-- Fecha duas lacunas encontradas em auditoria:
-- 1) request_identity_verification() aceitava pedidos duplicados
--    ("pendente" empilhado várias vezes para o mesmo perfil).
-- 2) Buckets de foto (profile-photos, experience-photos) não tinham limite
--    de tamanho nem de tipo MIME — qualquer arquivo, de qualquer tamanho,
--    era aceito.

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

  if exists (
    select 1 from public.verification_requests
    where profile_id = caller_profile.id and status = 'pendente'
  ) then
    raise exception 'Já existe uma verificação pendente para este perfil.';
  end if;

  insert into public.verification_requests (profile_id, profile_name, type, status)
  values (caller_profile.id, caller_profile.name, p_type, 'pendente')
  returning * into result;

  return result;
end;
$$;

update storage.buckets
set file_size_limit = 5242880, -- 5 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('profile-photos', 'experience-photos');
