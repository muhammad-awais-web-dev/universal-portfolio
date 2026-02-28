import { createClient } from '@supabase/supabase-js';
import type { Integration, IntegrationKey, IntegrationConfig, IntegrationPublic, IntegrationStatus } from './types';

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      // Disable Next.js fetch caching so integration status is always fresh
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  });
}

function maskValue(val: string): string {
  if (val.length <= 8) return '****';
  return val.slice(0, 4) + '****' + val.slice(-4);
}

function maskConfig(config: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(config)) {
    // mask secrets; keep non-secret fields like cloud_name and contact_email readable
    const isSecret = k.includes('secret') || k.includes('key');
    out[k] = isSecret ? maskValue(String(v)) : String(v);
  }
  return out;
}

export async function getIntegration(key: IntegrationKey): Promise<Integration | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('integrations')
      .select('*')
      .eq('key', key)
      .single();
    if (error || !data) return null;
    return data as Integration;
  } catch {
    return null;
  }
}

export async function getAllIntegrations(): Promise<IntegrationPublic[]> {
  try {
    const client = getClient();
    const { data, error } = await client.from('integrations').select('*');
    if (error || !data) return [];
    return (data as Integration[]).map((row) => ({
      key: row.key,
      status: row.status,
      error_message: row.error_message,
      connected_at: row.connected_at,
      updated_at: row.updated_at,
      masked: maskConfig(row.config as Record<string, string>),
    }));
  } catch {
    return [];
  }
}

export async function saveIntegration(
  key: IntegrationKey,
  config: IntegrationConfig,
  status: IntegrationStatus = 'connected'
): Promise<void> {
  const client = getClient();
  const { error } = await client.from('integrations').upsert({
    key,
    config,
    status,
    error_message: null,
    connected_at: status === 'connected' ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function disconnectIntegration(key: IntegrationKey): Promise<void> {
  const client = getClient();
  const { error } = await client.from('integrations').upsert({
    key,
    config: {},
    status: 'disconnected',
    error_message: null,
    connected_at: null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/** Call this fire-and-forget when a runtime usage of an integration fails */
export function markIntegrationError(key: IntegrationKey, message: string): void {
  const client = getClient();
  client.from('integrations').update({
    status: 'error',
    error_message: message,
    updated_at: new Date().toISOString(),
  }).eq('key', key).then(() => {/* fire and forget */});
}

export function getIntegrationPublic(row: Integration): IntegrationPublic {
  return {
    key: row.key,
    status: row.status,
    error_message: row.error_message,
    connected_at: row.connected_at,
    updated_at: row.updated_at,
    masked: maskConfig(row.config as Record<string, string>),
  };
}
