-- ============================================================
-- GLORY — Supabase schema (Phase 3)
-- Run in the Supabase SQL editor (Dashboard → SQL → New query).
-- Auth is handled by Clerk; we key rows by the Clerk user id (text).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- waitlist (public landing signups) ----------
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  role       text check (role in ('creator','brand')),
  source     text,
  created_at timestamptz not null default now()
);

-- ---------- profiles ----------
create table if not exists public.profiles (
  id                uuid primary key default gen_random_uuid(),
  clerk_user_id     text unique not null,
  role              text not null check (role in ('creator','brand')),
  handle            text,
  display_name      text,
  stripe_account_id text,          -- Stripe Connect (Express) account for creators
  payouts_enabled   boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ---------- listings (a creator's sellable reach) ----------
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  creator_id    text not null references public.profiles(clerk_user_id) on delete cascade,
  title         text not null,
  platform      text,
  reach         bigint default 0,
  price_cents   integer not null default 0,
  status        text not null default 'active' check (status in ('active','paused','archived')),
  created_at    timestamptz not null default now()
);

-- ---------- offers (a brand → creator proposal) ----------
create table if not exists public.offers (
  id            uuid primary key default gen_random_uuid(),
  brand_id      text not null references public.profiles(clerk_user_id) on delete cascade,
  creator_id    text not null references public.profiles(clerk_user_id) on delete cascade,
  listing_id    uuid references public.listings(id) on delete set null,
  scope         text not null,
  price_cents   integer not null default 0,
  status        text not null default 'awaiting_sign'
                  check (status in ('awaiting_sign','in_escrow','delivered','released','cancelled')),
  created_at    timestamptz not null default now()
);

-- ---------- deals (a signed offer moving to payout) ----------
create table if not exists public.deals (
  id                 uuid primary key default gen_random_uuid(),
  offer_id           uuid references public.offers(id) on delete cascade,
  stripe_payment_id  text unique,
  amount_cents       integer not null default 0,
  status             text not null default 'escrow'
                       check (status in ('escrow','released','refunded')),
  created_at         timestamptz not null default now()
);

-- ---------- media (creator portfolio: images + reels, hosted on Cloudinary) ----------
create table if not exists public.media (
  id            uuid primary key default gen_random_uuid(),
  creator_id    text not null references public.profiles(clerk_user_id) on delete cascade,
  public_id     text not null,
  resource_type text not null default 'image' check (resource_type in ('image','video')),
  url           text not null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_media_creator    on public.media(creator_id);
create index if not exists idx_listings_creator on public.listings(creator_id);
create index if not exists idx_offers_creator   on public.offers(creator_id);
create index if not exists idx_offers_brand      on public.offers(brand_id);

-- ============================================================
-- Row Level Security
-- The app's server uses the SERVICE ROLE key, which bypasses RLS.
-- These policies matter only if you later query from the browser with
-- a Clerk-signed JWT. To do that: create a Clerk JWT template named
-- "supabase" and configure Supabase to accept it, so auth.jwt()->>'sub'
-- equals the Clerk user id. Until then, RLS below denies anon access.
-- ============================================================
alter table public.waitlist enable row level security;
alter table public.media    enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.offers   enable row level security;
alter table public.deals    enable row level security;

-- Example (enable once the Clerk JWT template is wired):
-- create policy "own profile" on public.profiles
--   for all using (auth.jwt()->>'sub' = clerk_user_id);
-- create policy "own listings" on public.listings
--   for all using (auth.jwt()->>'sub' = creator_id);
