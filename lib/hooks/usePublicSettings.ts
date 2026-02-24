'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '@/lib/settings/types';
import type { PublicSettings } from '@/lib/settings/cached';

let cachedSettings: PublicSettings | null = null;
let fetchPromise: Promise<PublicSettings> | null = null;

async function fetchPublicSettings(): Promise<PublicSettings> {
  if (cachedSettings) return cachedSettings;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/api/settings/public')
    .then((r) => r.json())
    .then((data) => {
      cachedSettings = data;
      fetchPromise = null;
      return data as PublicSettings;
    })
    .catch(() => {
      fetchPromise = null;
      return {
        website_name: DEFAULT_SETTINGS.website_name,
        favicon_url: DEFAULT_SETTINGS.favicon_url,
        logo: DEFAULT_SETTINGS.logo,
        mcp_enabled: DEFAULT_SETTINGS.mcp_enabled,
      } as PublicSettings;
    });

  return fetchPromise;
}

/** Invalidate the in-memory module-level cache (call after saving settings) */
export function invalidatePublicSettingsCache() {
  cachedSettings = null;
  fetchPromise = null;
}

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>(() => ({
    website_name: DEFAULT_SETTINGS.website_name,
    favicon_url: DEFAULT_SETTINGS.favicon_url,
    logo: DEFAULT_SETTINGS.logo,
    mcp_enabled: DEFAULT_SETTINGS.mcp_enabled,
  }) as PublicSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
