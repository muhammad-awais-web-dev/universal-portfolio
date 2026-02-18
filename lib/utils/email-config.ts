/**
 * Email configuration utilities
 * Checks if Resend email service is properly configured
 */

/**
 * Check if email service is configured with required environment variables
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY && 
    process.env.CONTACT_EMAIL
  );
}

/**
 * Get contact email from environment
 */
export function getContactEmail(): string | null {
  return process.env.CONTACT_EMAIL || null;
}

/**
 * Get Resend API key from environment
 */
export function getResendApiKey(): string | null {
  return process.env.RESEND_API_KEY || null;
}
