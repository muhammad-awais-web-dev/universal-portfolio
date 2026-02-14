-- MCP API Keys Management
-- This migration adds support for managing multiple API keys with enable/disable functionality

-- Create mcp_api_keys table
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

-- Create indexes for performance
CREATE INDEX idx_mcp_api_keys_enabled ON public.mcp_api_keys(enabled) WHERE enabled = true;
CREATE INDEX idx_mcp_api_keys_key_hash ON public.mcp_api_keys(key_hash);
CREATE INDEX idx_mcp_api_keys_created_at ON public.mcp_api_keys(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_mcp_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mcp_api_keys_updated_at
  BEFORE UPDATE ON public.mcp_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_mcp_api_keys_updated_at();

-- Add RLS policies (Row Level Security)
ALTER TABLE public.mcp_api_keys ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server-side operations)
CREATE POLICY "Service role has full access to mcp_api_keys"
  ON public.mcp_api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE public.mcp_api_keys IS 'Stores API keys for MCP (Model Context Protocol) authentication';
COMMENT ON COLUMN public.mcp_api_keys.name IS 'Human-readable name/description for the API key';
COMMENT ON COLUMN public.mcp_api_keys.key_hash IS 'Bcrypt hash of the API key (never store plain keys)';
COMMENT ON COLUMN public.mcp_api_keys.enabled IS 'Whether this API key is currently active';
COMMENT ON COLUMN public.mcp_api_keys.last_used_at IS 'Timestamp of last successful authentication with this key';
