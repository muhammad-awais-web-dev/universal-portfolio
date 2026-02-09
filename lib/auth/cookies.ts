/**
 * Cookie Management Utilities
 * Handles HTTP-only session cookie operations
 */

import { cookies } from 'next/headers';
import { SESSION_DURATION, getSessionExpiryDate } from './session';

const SESSION_COOKIE_NAME = 'portfolio_session';

/**
 * Set the session cookie with HTTP-only, secure settings
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Get the session cookie value
 */
export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Check if a valid session cookie exists
 */
export async function hasSessionCookie(): Promise<boolean> {
  const token = await getSessionCookie();
  return token !== null && token.length > 0;
}
