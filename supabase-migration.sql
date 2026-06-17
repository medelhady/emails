-- Run this in Supabase SQL editor to create the leads table

CREATE TABLE IF NOT EXISTS public.leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  website      TEXT,
  email        TEXT,
  phone        TEXT,
  city         TEXT,
  state        TEXT,
  rating       NUMERIC(3, 1),
  reviews      INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraints for deduplication
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique
  ON public.leads (email)
  WHERE email IS NOT NULL AND email != '';

-- Optional: index for faster website lookups
CREATE INDEX IF NOT EXISTS leads_website_idx ON public.leads (website);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

-- Enable Row Level Security (optional — disable if no auth)
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Grant access to anon role (for use with anon key)
GRANT ALL ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;
