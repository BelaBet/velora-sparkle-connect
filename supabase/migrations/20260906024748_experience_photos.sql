-- Foto do catálogo de experiências: bucket público (precisa aparecer
-- pro membro no app), mas só admin escreve — catálogo é curado pelo
-- time, não pelos membros.

insert into storage.buckets (id, name, public)
values ('experience-photos', 'experience-photos', true)
on conflict (id) do nothing;

create policy "admins upload experience photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'experience-photos' and public.is_admin());

create policy "admins update experience photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'experience-photos' and public.is_admin());

create policy "admins delete experience photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'experience-photos' and public.is_admin());

alter table public.experiences add column image_url text;
