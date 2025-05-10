-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_tier as enum ('default', 'tier1', 'tier2', 'subscription');
create type order_status as enum ('pending', 'processing', 'completed', 'failed');
create type partner_status as enum ('pending', 'approved', 'rejected');
create type referral_status as enum ('pending', 'active', 'inactive'); 