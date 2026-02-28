import { getIntegration } from './repository';
import type { CloudinaryConfig } from './types';

/**
 * Get Cloudinary credentials — DB first, env vars fallback.
 * - DB record exists with status=connected → use DB creds
 * - DB record exists with status=disconnected → return null (user explicitly disconnected)
 * - No DB record (table exists, no row) → fall back to env vars
 * - DB unavailable (table missing / network error) → fall back to env vars
 */
export async function getCloudinaryConfig(): Promise<CloudinaryConfig | null> {
  let integration: Awaited<ReturnType<typeof getIntegration>> | undefined;
  try {
    integration = await getIntegration('cloudinary');
  } catch {
    // DB unavailable (migration not run, etc.) — fall back to env vars
    integration = undefined;
  }

  if (integration !== undefined) {
    // DB record exists — honour it exclusively (no env fallback)
    if (integration === null || integration.status === 'disconnected') return null;
    const cfg = integration.config as Partial<CloudinaryConfig>;
    if (cfg.cloud_name && cfg.api_key && cfg.api_secret) {
      return cfg as CloudinaryConfig;
    }
    return null;
  }

  // DB unavailable — fall back to env vars
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
