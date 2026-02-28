import { getIntegration } from './repository';
import type { ResendConfig } from './types';

/**
 * Get Resend credentials from DB only.
 * Env vars are NOT used — credentials must be connected via the Integrations page.
 * Returns null if not connected or DB unavailable.
 */
export async function getResendConfig(): Promise<ResendConfig | null> {
  try {
    const integration = await getIntegration('resend');
    if (!integration || integration.status !== 'connected') return null;
    const cfg = integration.config as Partial<ResendConfig>;
    if (cfg.api_key && cfg.contact_email) {
      return cfg as ResendConfig;
    }
    return null;
  } catch {
    return null;
  }
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
