-- Integrations table
-- Stores third-party service credentials and connection status.
-- Credentials are stored server-side only; client API returns masked values.

CREATE TABLE IF NOT EXISTS public.integrations (
  key           TEXT PRIMARY KEY,                        -- 'cloudinary' | 'resend'
  config        JSONB NOT NULL DEFAULT '{}',             -- service credentials
  status        TEXT NOT NULL DEFAULT 'disconnected',    -- connected | disconnected | error
  error_message TEXT,                                    -- last error (if status = error)
  connected_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Only service role can access this table (no public/anon access)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- No RLS policies — service role bypasses RLS entirely
-- anon and authenticated roles have zero access by default
