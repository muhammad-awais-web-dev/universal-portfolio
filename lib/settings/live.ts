// Tier 1: Live (uncached) settings — always reads fresh from DB.
// Use for settings that must take effect immediately (dev_mode, maintenance_mode).

import { getSetting, getAllSettings } from './repository';
import { SiteSettings } from './types';

export { getSetting as getLiveSetting };

export interface LiveSettings {
  dev_mode: boolean;
  maintenance_mode: boolean;
  contact_form_enabled: boolean;
}

/** Read only the Tier-1 (live) settings as a partial object */
export async function getLiveSettings(): Promise<LiveSettings> {
  const all = await getAllSettings();
  return {
    dev_mode: all.dev_mode,
    maintenance_mode: all.maintenance_mode,
    contact_form_enabled: all.contact_form_enabled,
  };
}

// Re-export for convenience
export type { SiteSettings };
