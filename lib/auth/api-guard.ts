/**
 * API Route Protection Utilities
 * Middleware helper for protecting API endpoints
 */

import { NextResponse } from 'next/server';
import { getSessionCookie } from './cookies';
import { verifySession } from './session';

/**
 * Require authentication for an API route
 * Returns null if authenticated, otherwise returns a 401 response
 * 
 * Usage in API route:
 * const authError = await requireAuth();
 * if (authError) return authError;
 */
export async function requireAuth(): Promise<NextResponse | null> {
  try {
    const token = await getSessionCookie();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session found' },
        { status: 401 }
      );
    }
    
    const isValid = await verifySession(token);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    return null; // Authentication successful
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication failed' },
      { status: 401 }
    );
  }
}
