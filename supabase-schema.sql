-- Esquema do banco de dados v2 — Rótulo Diário (Contador de Calorias)
-- Agora com autenticação real (Supabase Auth) e Row Level Security (RLS).
--
-- ATENÇÃO: isso substitui o esquema anterior. Como os dados de teste que
-- existem hoje (alimentos, registros) usam um "user_id" fixo de mentira
-- ('default_user'), que não é compatível com o novo formato, a forma mais
-- simples é começar do zero: este arquivo já apaga as tabelas antigas antes
-- de recriar, já que eram só dados de teste.
--
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em Run.

-- 1) Apaga as tabelas antigas (se existirem) para recriar do zero
drop table if exists daily_logs cascade;
drop table if exists activities cascade;
drop table if exists foods cascade;
drop table if exists routines cascade;
drop table if exists targets cascade;
drop table if exists profile cascade;

create extension if not exists "uuid-ossp";

-- 2) Tabelas — agora user_id é uuid e referencia o usuário autenticado (auth.users)

create table foods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kcal numeric not null,
  protein numeric not null default 0,
  carb numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz default now()
);

create table targets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  kcal numeric not null default 2200,
  protein numeric not null default 170,
  carb numeric not null default 220,
  fat numeric not null default 65,
  updated_at timestamptz default now()
);

create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  food_id uuid references foods(id) on delete set null,
  name text not null,
  grams numeric not null,
  kcal numeric not null,
  protein numeric not null default 0,
  carb numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz default now()
);
create index idx_daily_logs_user_date on daily_logs(user_id, log_date);

create table routines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  duration numeric not null default 50,
  intensity text not null default 'moderada'
);

create table activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  routine_id uuid references routines(id) on delete set null,
  name text not null,
  intensity text not null,
  duration numeric not null,
  kcal numeric not null,
  created_at timestamptz default now()
);
create index idx_activities_user_date on activities(user_id, activity_date);

create table profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text default '',
  bodyweight numeric default 95,
  height numeric default 175,
  age numeric default 29,
  sex text default 'm',
  activity_level numeric default 1.55,
  goal numeric default -500,
  recent_foods jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- 3) Ativa Row Level Security em todas as tabelas
alter table foods enable row level security;
alter table targets enable row level security;
alter table daily_logs enable row level security;
alter table routines enable row level security;
alter table activities enable row level security;
alter table profile enable row level security;

-- 4) Políticas: cada usuário só enxerga e mexe nas próprias linhas
-- (auth.uid() é o id do usuário logado, fornecido automaticamente pelo Supabase)

create policy "own rows only" on foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows only" on targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows only" on daily_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows only" on routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows only" on activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows only" on profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A partir de agora: sem estar logado, ninguém lê nem escreve nada nessas
-- tabelas — nem mesmo com a chave pública do app em mãos. Cada usuário só
-- vê os próprios dados, mesmo que dois usuários diferentes usem o mesmo app.
