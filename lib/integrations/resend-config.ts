import { getIntegration } from './repository';
import type { ResendConfig } from './types';

/**
 * Get Resend credentials — DB first, env vars fallback.
 * - DB record exists with status=connected → use DB creds
 * - DB record exists with status=disconnected → return null (user explicitly disconnected)
 * - No DB record (table exists, no row) → fall back to env vars
 * - DB unavailable (table missing / network error) → fall back to env vars
 */
export async function getResendConfig(): Promise<ResendConfig | null> {
  let integration: Awaited<ReturnType<typeof getIntegration>> | undefined;
  try {
    integration = await getIntegration('resend');
  } catch {
    // DB unavailable — fall back to env vars
    integration = undefined;
  }

  if (integration !== undefined) {
    // DB record exists — honour it exclusively (no env fallback)
    if (integration === null || integration.status === 'disconnected') return null;
    const cfg = integration.config as Partial<ResendConfig>;
    if (cfg.api_key && cfg.contact_email) {
      return cfg as ResendConfig;
    }
    return null;
  }

  // DB unavailable — fall back to env vars
  const api_key = process.env.RESEND_API_KEY;
  const contact_email = process.env.CONTACT_EMAIL;
  if (api_key && contact_email) {
    return { api_key, contact_email };
  }

  return null;
}

/** Whether Resend is configured (DB or env) */
export async function isResendConfigured(): Promise<boolean> {
  return (await getResendConfig()) !== null;
}

// Drop-in replacements for lib/utils/email-config.ts — sync wrappers
// that check env vars only (for backward compat in sync contexts)
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL);
}
export function getResendApiKey(): string | null {
  return process.env.RESEND_API_KEY || null;
}
export function getContactEmail(): string | null {
  return process.env.CONTACT_EMAIL || null;
}
