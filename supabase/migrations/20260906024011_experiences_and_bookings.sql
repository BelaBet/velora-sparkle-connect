-- Catálogo de experiências (curado pelo time, não pelos membros) e
-- reservas reais — antes "Reservar" só mostrava um toast e não gravava nada.

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null,
  city text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

create policy "authenticated can view experiences" on public.experiences
  for select to authenticated using (true);

create policy "admins manage experiences" on public.experiences
  for all using (public.is_admin()) with check (public.is_admin());

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  profile_id uuid not null references public.member_profiles(id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now(),
  unique (experience_id, profile_id)
);

alter table public.bookings enable row level security;

create policy "members view own bookings" on public.bookings
  for select using (profile_id = public.own_profile_id());

create policy "members create own bookings" on public.bookings
  for insert with check (profile_id = public.own_profile_id() and status = 'pendente');

create policy "admins manage bookings" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.experiences (title, venue, city, detail) values
  ('Jantar reservado', 'Salon Privé · Jardins', 'São Paulo', 'Salão privativo, menu degustação para dois e entrada discreta pelo lobby.'),
  ('Rooftop ao entardecer', 'Terraço Aurora · Itaim', 'São Paulo', 'Coquetéis autorais e vista panorâmica, com reserva de mesa privativa.');
