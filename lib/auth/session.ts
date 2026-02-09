/**
 * Session Management Utilities
 * Handles passphrase verification and session token creation/validation
 */

import { SignJWT, jwtVerify } from 'jose';

const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || '';
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_PASSPHRASE || 'fallback-secret-key'
);

// Session duration: 7 days in seconds
export const SESSION_DURATION = 7 * 24 * 60 * 60; // 604800 seconds

/**
 * Verify if the provided passphrase matches the admin passphrase
 */
export function verifyPassphrase(input: string): boolean {
  if (!ADMIN_PASSPHRASE) {
    console.error('ADMIN_PASSPHRASE not set in environment variables');
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (input.length !== ADMIN_PASSPHRASE.length) {
    return false;
  }
  
  let match = true;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== ADMIN_PASSPHRASE[i]) {
      match = false;
    }
  }
  
  return match;
}

/**
 * Create a new session token (JWT) with 7-day expiry
 */
export async function createSession(): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_DURATION)
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Verify a session token and check if it's still valid
 */
export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check if token has admin claim
    if (!payload.admin) {
      return false;
    }
    
    // JWT library automatically checks expiration
    return true;
  } catch (error) {
    // Token is invalid or expired
    return false;
  }
}

/**
 * Get session expiry date (7 days from now)
 */
export function getSessionExpiryDate(): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
}
