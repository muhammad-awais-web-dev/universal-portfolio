/**
 * Logout API Route
 * Clears session cookie
 */

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/cookies';

export async function POST() {
  try {
    // Clear the session cookie
    await clearSessionCookie();

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
