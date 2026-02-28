import { getIntegration } from './repository';
import type { CloudinaryConfig } from './types';

/**
 * Get Cloudinary credentials from DB only.
 * Env vars are NOT used — credentials must be connected via the Integrations page.
 * Returns null if not connected or DB unavailable.
 */
export async function getCloudinaryConfig(): Promise<CloudinaryConfig | null> {
  try {
    const integration = await getIntegration('cloudinary');
    if (!integration || integration.status !== 'connected') return null;
    const cfg = integration.config as Partial<CloudinaryConfig>;
    if (cfg.cloud_name && cfg.api_key && cfg.api_secret) {
      return cfg as CloudinaryConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/** Whether Cloudinary is configured (DB or env) */
export async function isCloudinaryConfigured(): Promise<boolean> {
  return (await getCloudinaryConfig()) !== null;
}
