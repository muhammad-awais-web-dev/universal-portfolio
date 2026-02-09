/**
 * Verify Session API Route
 * Checks if the current session is valid
 */

import { NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/auth/cookies';
import { verifySession } from '@/lib/auth/session';

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No session found' },
        { status: 200 }
      );
    }

    const isValid = await verifySession(token);

    return NextResponse.json(
      { authenticated: isValid },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Session verification failed' },
      { status: 200 }
    );
  }
}
