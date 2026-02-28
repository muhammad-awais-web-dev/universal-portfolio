import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';
import { getCloudinaryConfig } from '@/lib/integrations/cloudinary-config';

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const cfg = await getCloudinaryConfig();
  if (!cfg) return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 });
  cloudinary.config({ cloud_name: cfg.cloud_name, api_key: cfg.api_key, api_secret: cfg.api_secret });

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
