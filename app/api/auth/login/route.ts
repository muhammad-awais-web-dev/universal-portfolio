/**
 * Login API Route
 * Verifies passphrase and creates session
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassphrase, createSession } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passphrase } = body;

    if (!passphrase || typeof passphrase !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Passphrase is required' },
        { status: 400 }
      );
    }

    // Verify the passphrase
    const isValid = verifyPassphrase(passphrase);

    if (!isValid) {
      // Add a small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid passphrase' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSession();

    // Set session cookie
    await setSessionCookie(token);

    return NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
