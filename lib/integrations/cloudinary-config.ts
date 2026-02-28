import { getIntegration } from './repository';
import type { CloudinaryConfig } from './types';

/**
 * Get Cloudinary credentials — DB first, env vars fallback.
 * If a DB record exists (even disconnected), env vars are NOT used —
 * a disconnected status means the user explicitly disabled it.
 * Env vars are only used when there is no DB record at all.
 */
export async function getCloudinaryConfig(): Promise<CloudinaryConfig | null> {
  // Try DB first
  const integration = await getIntegration('cloudinary');
  if (integration) {
    // DB record exists — respect its status; do NOT fall back to env vars
    if (integration.status === 'disconnected') return null;
    const cfg = integration.config as Partial<CloudinaryConfig>;
    if (cfg.cloud_name && cfg.api_key && cfg.api_secret) {
      return cfg as CloudinaryConfig;
    }
    return null;
  }

  // No DB record at all — fall back to env vars
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
