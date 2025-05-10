-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_tier as enum ('default', 'tier1', 'tier2', 'subscription');
create type order_status as enum ('pending', 'processing', 'completed', 'failed');
create type partner_status as enum ('pending', 'approved', 'rejected');
create type referral_status as enum ('pending', 'active', 'inactive');

-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tier user_tier default 'default'::user_tier not null,
  subscription_end_date timestamp with time zone,
  referral_code text unique,
  constraint profiles_pkey primary key (id)
);

-- Create user_stats table
create table public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_labels integer default 0 not null,
  total_earnings decimal(10,2) default 0 not null,
  active_referrals integer default 0 not null,
  pending_orders integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_stats_pkey primary key (id),
  constraint user_stats_user_id_key unique (user_id)
);

-- Create orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rate_id text not null,
  amount decimal(10,2) not null,
  status order_status default 'pending'::order_status not null,
  label_url text,
  tracking_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create referrals table
create table public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_user_id uuid references public.profiles(id) on delete cascade not null,
  status referral_status default 'pending'::referral_status not null,
  earnings decimal(10,2) default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint referrals_referrer_referred_unique unique (referrer_id, referred_user_id)
);

-- Create referral_stats table
create table public.referral_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_referrals integer default 0 not null,
  active_referrals integer default 0 not null,
  total_earnings decimal(10,2) default 0 not null,
  pending_earnings decimal(10,2) default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint referral_stats_pkey primary key (id),
  constraint referral_stats_user_id_key unique (user_id)
);

-- Create partners table
create table public.partners (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status partner_status default 'pending'::partner_status not null,
  name text not null,
  email text not null,
  social_links text,
  experience text,
  why_partner text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint partners_pkey primary key (id),
  constraint partners_user_id_key unique (user_id)
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.orders enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_stats enable row level security;
alter table public.partners enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- User stats policies
create policy "Users can view their own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

-- Orders policies
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Referrals policies
create policy "Users can view their own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_user_id);

create policy "Users can create referrals"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- Referral stats policies
create policy "Users can view their own referral stats"
  on public.referral_stats for select
  using (auth.uid() = user_id);

-- Partners policies
create policy "Users can view their own partner status"
  on public.partners for select
  using (auth.uid() = user_id);

create policy "Users can create partner applications"
  on public.partners for insert
  with check (auth.uid() = user_id);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create profile
  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, substr(md5(random()::text), 1, 8));

  -- Create user stats
  insert into public.user_stats (user_id)
  values (new.id);

  -- Create referral stats
  insert into public.referral_stats (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update user tier
create or replace function public.update_user_tier()
returns trigger as $$
begin
  if new.total_labels >= 200 then
    update public.profiles
    set tier = 'tier2'::user_tier
    where id = new.user_id;
  elsif new.total_labels >= 50 then
    update public.profiles
    set tier = 'tier1'::user_tier
    where id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for user tier updates
create trigger on_user_stats_update
  after update on public.user_stats
  for each row
  when (old.total_labels is distinct from new.total_labels)
  execute procedure public.update_user_tier(); 