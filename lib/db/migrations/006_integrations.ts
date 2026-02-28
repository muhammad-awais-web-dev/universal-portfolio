export const migration_006_integrations = `
-- Migration 006: Integrations table
-- Stores third-party service credentials and connection status.
-- Credentials are stored server-side only; client API returns masked values.

CREATE TABLE IF NOT EXISTS public.integrations (
  key           TEXT PRIMARY KEY,
  config        JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'disconnected',
  error_message TEXT,
  connected_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Only service role can access this table (no public/anon access)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
`;
