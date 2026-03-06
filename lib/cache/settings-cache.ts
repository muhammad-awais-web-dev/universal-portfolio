import { unstable_cache } from 'next/cache';
import { getSetting } from '@/lib/settings/repository';
import { checkCriticalEnvVars } from '@/lib/settings';
import { isResendConfigured } from '@/lib/integrations/resend-config';

const CACHE_TAG = 'portfolio';
const CACHE_TTL = 60; // 60 seconds — settings should propagate quickly

/**
 * Cached public-facing settings.
 * Tagged with 'portfolio' so they revalidate alongside content changes.
 */
export const getCachedPublicSettings = unstable_cache(
  async () => {
    const devMode = await getSetting('dev_mode').catch(() => false);
    const { isValid: envValid, missing: missingVars } = checkCriticalEnvVars();
    const isEmailConfigured = await isResendConfigured();
    const envFlag = (process.env.ENVIRONMENT || '').toLowerCase();
    const forceDevMode = !envValid || envFlag === 'development' || devMode === true;

    return { forceDevMode, missingVars, isEmailConfigured };
  },
  ['public-settings'],
  { revalidate: CACHE_TTL, tags: [CACHE_TAG] }
);
