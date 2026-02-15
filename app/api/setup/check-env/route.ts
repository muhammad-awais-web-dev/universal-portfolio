/**
 * API route to check if an environment variable is configured
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const varName = searchParams.get('var');

    if (!varName) {
      return NextResponse.json(
        { error: 'Variable name required' },
        { status: 400 }
      );
    }

    const value = process.env[varName];
    const configured = Boolean(value && value.trim().length > 0);

    return NextResponse.json({ configured, variable: varName });
  } catch (error) {
    console.error('Env check error:', error);
    return NextResponse.json(
      { error: 'Failed to check environment variable' },
      { status: 500 }
    );
  }
}
