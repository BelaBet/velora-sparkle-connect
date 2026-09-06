-- Tabelas de gestão do painel administrativo Velora

create table public.member_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int not null,
  email text not null,
  city text not null,
  status text not null default 'pendente' check (status in ('ativo', 'suspenso', 'pendente')),
  verified boolean not null default false,
  joined_at date not null default current_date,
  reports_count int not null default 0,
  created_at timestamptz not null default now()
);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.member_profiles(id) on delete set null,
  profile_name text not null,
  type text not null check (type in ('identidade', 'liveness')),
  submitted_at date not null default current_date,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'rejeitada')),
  created_at timestamptz not null default now()
);

create table public.security_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_name text not null,
  reported_name text not null,
  reason text not null,
  details text not null,
  submitted_at date not null default current_date,
  severity text not null check (severity in ('baixa', 'média', 'alta')),
  status text not null default 'aberto' check (status in ('aberto', 'em análise', 'resolvido')),
  created_at timestamptz not null default now()
);

create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- Helper de autorização: evita recursão de RLS ao checar a própria tabela admins
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

alter table public.member_profiles enable row level security;
alter table public.verification_requests enable row level security;
alter table public.security_reports enable row level security;
alter table public.admins enable row level security;

create policy "admins manage member_profiles" on public.member_profiles
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage verification_requests" on public.verification_requests
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage security_reports" on public.security_reports
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins can read own admin row" on public.admins
  for select using (id = auth.uid());

-- Dados de exemplo para o painel não nascer vazio
insert into public.member_profiles (name, age, email, city, status, verified, joined_at, reports_count) values
  ('Juliana Duarte', 29, 'juliana@exemplo.com', 'São Paulo', 'ativo', true, date '2026-03-12', 0),
  ('Rafael Mendes', 34, 'rafael@exemplo.com', 'São Paulo', 'ativo', true, date '2026-02-03', 1),
  ('Marina Costa', 31, 'marina@exemplo.com', 'São Paulo', 'pendente', false, date '2026-08-28', 0),
  ('Diego Alves', 38, 'diego@exemplo.com', 'Rio de Janeiro', 'suspenso', true, date '2026-01-14', 3);

insert into public.verification_requests (profile_id, profile_name, type, submitted_at, status)
select id, name, 'identidade'::text, date '2026-09-05', 'pendente'::text from public.member_profiles where name = 'Marina Costa'
union all
select id, name, 'liveness'::text, date '2026-09-05', 'pendente'::text from public.member_profiles where name = 'Marina Costa'
union all
select id, name, 'identidade'::text, date '2026-09-01', 'aprovada'::text from public.member_profiles where name = 'Diego Alves';

insert into public.security_reports (reporter_name, reported_name, reason, details, submitted_at, severity, status) values
  ('Juliana Duarte', 'Diego Alves', 'Comportamento inadequado', 'Insistiu em pedir dados pessoais fora do app.', date '2026-09-04', 'alta', 'aberto'),
  ('Rafael Mendes', 'Perfil desconhecido', 'Suspeita de perfil falso', 'Fotos parecem ser de banco de imagens.', date '2026-08-30', 'média', 'em análise'),
  ('Marina Costa', 'Diego Alves', 'Assédio', 'Mensagens insistentes após pedido de bloqueio.', date '2026-08-20', 'alta', 'resolvido');

-- Conta administrativa inicial (login separado do app de membros).
-- Trocar a senha depois do primeiro acesso pelo painel de Auth do Supabase.
do $$
declare
  new_user_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated',
    'admin@velora.com', extensions.crypt('Velora#Admin2026', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(),
    '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), new_user_id, new_user_id::text,
    jsonb_build_object('sub', new_user_id::text, 'email', 'admin@velora.com'),
    'email', now(), now(), now()
  );

  insert into public.admins (id, email) values (new_user_id, 'admin@velora.com');
end $$;
