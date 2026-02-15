/**
 * API route to get hash of environment variables
 * Used for caching validation results
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Get current env var values and create a hash
    const envString = [
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      process.env.ADMIN_PASSPHRASE || '',
      process.env.CLOUDINARY_CLOUD_NAME || '',
      process.env.CLOUDINARY_API_KEY || '',
    ].join('|');

    const hash = crypto.createHash('sha256').update(envString).digest('hex');

    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Hash generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hash' },
      { status: 500 }
    );
  }
}
