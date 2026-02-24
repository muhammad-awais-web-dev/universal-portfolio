// Direct Supabase reads for site_settings — no caching layer.
// Used server-side only (service role key).

import { createClient } from '@supabase/supabase-js';
import { SiteSettings, DEFAULT_SETTINGS } from './types';

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Read a single setting from DB, returns typed default if missing */
export async function getSetting<K extends keyof SiteSettings>(
  key: K
): Promise<SiteSettings[K]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('site_settings')
      .select('value')
      .eq('key', key as string)
      .single();

    if (error || !data) return DEFAULT_SETTINGS[key];
    return data.value as SiteSettings[K];
  } catch {
    return DEFAULT_SETTINGS[key];
  }
}

/** Read all settings from DB, merges with defaults for any missing keys */
export async function getAllSettings(): Promise<SiteSettings> {
  try {
    const client = getClient();
    const { data, error } = await client.from('site_settings').select('key, value');
    if (error || !data) return DEFAULT_SETTINGS;

    const map = Object.fromEntries(data.map((r: { key: string; value: unknown }) => [r.key, r.value]));
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Write one or more settings to DB */
export async function saveSetting(
  updates: Partial<SiteSettings>
): Promise<void> {
  const client = getClient();
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await client
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) throw new Error(`Failed to save settings: ${error.message}`);
}
