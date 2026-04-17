create extension if not exists "pgcrypto";

create type material_category as enum ('malt', 'hop', 'yeast', 'adjunct');
create type transaction_type as enum ('IN', 'OUT');

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category material_category not null,
  unit text not null,
  threshold numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  material_id uuid not null references public.materials(id) on delete cascade,
  lot_no text not null,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  quantity_total numeric not null,
  quantity_remaining numeric not null,
  cost_per_unit numeric not null,
  received_date date not null,
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete cascade,
  type transaction_type not null,
  quantity numeric not null,
  date timestamptz not null,
  pdf_metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.materials;
alter publication supabase_realtime add table public.lots;
alter publication supabase_realtime add table public.transactions;

alter table public.materials enable row level security;
alter table public.vendors enable row level security;
alter table public.lots enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_logs enable row level security;

create policy "materials_owner_only" on public.materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vendors_owner_only" on public.vendors for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "lots_owner_only" on public.lots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_owner_only" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "audit_owner_only" on public.audit_logs for select using (auth.uid() = user_id);

create or replace function public.set_user_id_if_missing() returns trigger language plpgsql as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

create trigger set_user_id_materials before insert on public.materials for each row execute function public.set_user_id_if_missing();
create trigger set_user_id_vendors before insert on public.vendors for each row execute function public.set_user_id_if_missing();
create trigger set_user_id_lots before insert on public.lots for each row execute function public.set_user_id_if_missing();
create trigger set_user_id_transactions before insert on public.transactions for each row execute function public.set_user_id_if_missing();
