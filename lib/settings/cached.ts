// Tier 2: Short-cached settings — 5 minute TTL, tag-invalidated on save.
// Use for public-facing cosmetic settings (logo, favicon, website_name, mcp_enabled).

import { unstable_cache } from 'next/cache';
import { getAllSettings } from './repository';
import { DEFAULT_SETTINGS } from './types';
import type { LogoSettings } from './types';

export const SETTINGS_CACHE_TAG = 'site-settings';

export interface PublicSettings {
  website_name: string;
  favicon_url: string | null;
  logo: LogoSettings;
  mcp_enabled: boolean;
}

/**
 * Get the Tier-2 cached settings.
 * Automatically refreshed within 5 minutes or when revalidateTag('site-settings') is called.
 */
export const getCachedPublicSettings: () => Promise<PublicSettings> = unstable_cache(
  async (): Promise<PublicSettings> => {
    const all = await getAllSettings();
    return {
      website_name: all.website_name,
      favicon_url: all.favicon_url,
      logo: all.logo,
      mcp_enabled: all.mcp_enabled,
    };
  },
  ['site-settings-public'],
  {
    revalidate: 300, // 5 minutes
    tags: [SETTINGS_CACHE_TAG],
  }
);

/** Safe fallback — returns defaults without hitting the DB */
export function getDefaultPublicSettings(): PublicSettings {
  return {
    website_name: DEFAULT_SETTINGS.website_name,
    favicon_url: DEFAULT_SETTINGS.favicon_url,
    logo: DEFAULT_SETTINGS.logo,
    mcp_enabled: DEFAULT_SETTINGS.mcp_enabled,
  };
}
