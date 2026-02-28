export const migration_004_mcp_api_key_permissions = `
-- Migration 004: Add can_write permission to MCP API keys

ALTER TABLE public.mcp_api_keys
  ADD COLUMN IF NOT EXISTS can_write BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.mcp_api_keys.can_write IS 'Whether this key can perform write (create/update/delete) operations via MCP';
`;
