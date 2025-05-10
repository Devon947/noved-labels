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

-- Create contact_messages table
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
); 