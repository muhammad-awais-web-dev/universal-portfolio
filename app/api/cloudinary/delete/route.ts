import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { publicIds } = body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: 'publicIds array is required' },
        { status: 400 }
      );
    }

    // Delete multiple images from Cloudinary
    const results = await cloudinary.api.delete_resources(publicIds);

    return NextResponse.json({
      success: true,
      deleted: results.deleted,
      failed: results.partial || {},
    });
  } catch (error: unknown) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete images' },
      { status: 500 }
    );
  }
}
