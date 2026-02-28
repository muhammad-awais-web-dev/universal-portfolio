import { getIntegration } from './repository';
import type { CloudinaryConfig } from './types';

/**
 * Get Cloudinary credentials — DB first, env vars fallback.
 * Returns null if neither source has credentials.
 */
export async function getCloudinaryConfig(): Promise<CloudinaryConfig | null> {
  // Try DB first
  const integration = await getIntegration('cloudinary');
  if (integration && integration.status !== 'disconnected') {
    const cfg = integration.config as Partial<CloudinaryConfig>;
    if (cfg.cloud_name && cfg.api_key && cfg.api_secret) {
      return cfg as CloudinaryConfig;
    }
  }

  // Fallback to env vars
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud_name && api_key && api_secret) {
    return { cloud_name, api_key, api_secret };
  }

  return null;
}

/** Whether Cloudinary is configured (DB or env) */
export async function isCloudinaryConfigured(): Promise<boolean> {
  return (await getCloudinaryConfig()) !== null;
}
