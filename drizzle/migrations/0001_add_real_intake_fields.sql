alter table public.leads
  add column if not exists service text,
  add column if not exists objection text,
  add column if not exists commitment text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists instagram text;

update public.leads set service = 'One month INTEGRAL' where service is null;