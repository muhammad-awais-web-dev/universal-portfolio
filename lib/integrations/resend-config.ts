import { getIntegration } from './repository';
import type { ResendConfig } from './types';

/**
 * Get Resend credentials — DB first, env vars fallback.
 * If a DB record exists (even disconnected), env vars are NOT used —
 * a disconnected status means the user explicitly disabled it.
 * Env vars are only used when there is no DB record at all.
 */
export async function getResendConfig(): Promise<ResendConfig | null> {
  // Try DB first
  const integration = await getIntegration('resend');
  if (integration) {
    // DB record exists — respect its status; do NOT fall back to env vars
    if (integration.status === 'disconnected') return null;
    const cfg = integration.config as Partial<ResendConfig>;
    if (cfg.api_key && cfg.contact_email) {
      return cfg as ResendConfig;
    }
    return null;
  }

  // No DB record at all — fall back to env vars
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
