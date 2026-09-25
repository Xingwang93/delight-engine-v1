create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null,
  motivation text not null,
  lane text not null check (lane in ('gym','online')),
  status text not null default 'new' check (status in ('new','pending')),
  price numeric,
  source text not null default 'demo',
  created_at timestamptz not null default now()
);

grant select, insert, update on public.leads to anon, authenticated;
grant all on public.leads to service_role;

alter table public.leads enable row level security;

create policy "Anyone can read leads" on public.leads for select to anon, authenticated using (true);
create policy "Anyone can submit leads" on public.leads for insert to anon, authenticated with check (true);
create policy "Anyone can update lead status" on public.leads for update to anon, authenticated using (true) with check (true);

insert into public.leads (name, goal, motivation, lane, status, price, source) values
('María G.', 'Fat loss & body recomp', 'Wants to feel confident for her wedding in June', 'online', 'new', 150, 'demo'),
('Jorge P.', 'Muscle gain', 'Tired of training with no visible results', 'gym', 'new', 180, 'demo'),
('Lucía R.', 'Fat loss & body recomp', 'Postpartum recovery, wants energy back', 'online', 'new', 140, 'demo'),
('Andrés M.', 'Strength & conditioning', 'Prepping for a hiking trip with friends', 'gym', 'pending', 160, 'demo'),
('Carla T.', 'General fitness', 'First time in a gym, feels intimidated', 'gym', 'new', 120, 'demo'),
('Diego S.', 'Athletic performance', 'Competes in padel, wants to be faster', 'online', 'new', 190, 'demo'),
('Nadia F.', 'Fat loss & body recomp', 'Big birthday in 3 months, wants to celebrate strong', 'online', 'new', 150, 'demo'),
('Pablo V.', 'Muscle gain', 'Skinny his whole life, ready to commit', 'gym', 'new', 170, 'demo');