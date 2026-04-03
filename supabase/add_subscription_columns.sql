-- Add Stripe subscription columns to profiles table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- Index for fast customer lookups from webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles (stripe_customer_id);

-- RLS: users can only read their own subscription data
-- (write is only via service role in webhook handler)
CREATE POLICY IF NOT EXISTS "Users can view own subscription"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
