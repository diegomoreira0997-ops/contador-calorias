-- Esquema do banco de dados — Rótulo Diário (Contador de Calorias)
-- Cole este SQL inteiro no SQL Editor do Supabase (menu lateral > SQL Editor > New query) e clique em Run.

-- Extensão necessária para gerar IDs únicos (geralmente já vem habilitada no Supabase)
create extension if not exists "uuid-ossp";

-- Alimentos cadastrados (base de dados + itens criados pelo usuário)
create table foods (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'default_user',
  name text not null,
  kcal numeric not null,
  protein numeric not null default 0,
  carb numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz default now()
);

-- Metas diárias de calorias e macronutrientes (uma linha por usuário)
create table targets (
  user_id text primary key default 'default_user',
  kcal numeric not null default 2200,
  protein numeric not null default 170,
  carb numeric not null default 220,
  fat numeric not null default 65,
  updated_at timestamptz default now()
);

-- Registro diário de alimentos consumidos
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'default_user',
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

-- Rotinas de treino/atividade cadastradas
create table routines (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'default_user',
  name text not null,
  duration numeric not null default 50,
  intensity text not null default 'moderada'
);

-- Registro diário de atividades físicas
create table activities (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'default_user',
  activity_date date not null,
  routine_id uuid references routines(id) on delete set null,
  name text not null,
  intensity text not null,
  duration numeric not null,
  kcal numeric not null,
  created_at timestamptz default now()
);
create index idx_activities_user_date on activities(user_id, activity_date);

-- Perfil do usuário (nome, peso, dados para a calculadora)
create table profile (
  user_id text primary key default 'default_user',
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

-- IMPORTANTE — sobre segurança (RLS):
-- Por enquanto o app não tem sistema de login (autenticação), então todas as
-- tabelas ficam com Row Level Security desabilitado, e a "anon key" (pública)
-- consegue ler e escrever livremente. Isso é aceitável nesta fase de
-- desenvolvimento/aprendizado, mas ANTES de comercializar de verdade — ou seja,
-- antes de ter outros usuários além de você — é essencial:
--   1. Adicionar autenticação (Supabase Auth)
--   2. Ativar Row Level Security em cada tabela
--   3. Criar políticas que restrinjam cada usuário a ver/editar só os próprios dados
-- Isso fica para uma etapa futura, quando formos adicionar login.
