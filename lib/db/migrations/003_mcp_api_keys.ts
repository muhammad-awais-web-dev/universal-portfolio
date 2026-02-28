export const migration_003_mcp_api_keys = `
-- Migration 003: MCP API Keys table

CREATE TABLE IF NOT EXISTS public.mcp_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,

  CONSTRAINT name_length CHECK (char_length(name) >= 3),
  CONSTRAINT key_hash_length CHECK (char_length(key_hash) > 0)
);

CREATE INDEX IF NOT EXISTS idx_mcp_api_keys_enabled ON public.mcp_api_keys(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_mcp_api_keys_key_hash ON public.mcp_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_mcp_api_keys_created_at ON public.mcp_api_keys(created_at DESC);

CREATE OR REPLACE FUNCTION update_mcp_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_mcp_api_keys_updated_at
  BEFORE UPDATE ON public.mcp_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_mcp_api_keys_updated_at();

ALTER TABLE public.mcp_api_keys ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcp_api_keys' AND policyname = 'Service role has full access to mcp_api_keys') THEN
    CREATE POLICY "Service role has full access to mcp_api_keys"
      ON public.mcp_api_keys
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
`;
