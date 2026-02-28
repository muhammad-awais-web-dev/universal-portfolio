import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';
import { getCloudinaryConfig } from '@/lib/integrations/cloudinary-config';

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const cfg = await getCloudinaryConfig();
  if (!cfg) return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 });
  cloudinary.config({ cloud_name: cfg.cloud_name, api_key: cfg.api_key, api_secret: cfg.api_secret });

  try {
    const body = await request.json();
    const { oldPublicId, newPublicId } = body;

    if (!oldPublicId || !newPublicId) {
      return NextResponse.json(
        { error: 'oldPublicId and newPublicId are required' },
        { status: 400 }
      );
    }

    // Rename the image in Cloudinary
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);

    return NextResponse.json({
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error: unknown) {
    console.error('Error renaming image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rename image' },
      { status: 500 }
    );
  }
}
