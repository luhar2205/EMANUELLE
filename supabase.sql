create table if not exists rsvp (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  name_norm text not null unique,
  phone_norm text not null unique,
  status text not null check (status in ('presente','ausente')),
  note text,
  created_at timestamptz not null default now()
);
alter table rsvp enable row level security; -- sem policies: só o servidor (service key) acessa
