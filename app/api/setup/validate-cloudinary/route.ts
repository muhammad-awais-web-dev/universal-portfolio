/**
 * API route to validate Cloudinary connection
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { valid: false, error: 'Cloudinary credentials not configured' },
        { status: 400 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test connection by pinging the API
    try {
      const result = await cloudinary.api.ping();
      
      if (result.status === 'ok') {
        return NextResponse.json({ valid: true });
      }
      
      return NextResponse.json(
        { valid: false, error: 'Cloudinary ping failed' },
        { status: 400 }
      );
    } catch (cloudinaryError: any) {
      return NextResponse.json(
        { valid: false, error: cloudinaryError.message || 'Connection failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Cloudinary validation error:', error);
    return NextResponse.json(
      { valid: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
