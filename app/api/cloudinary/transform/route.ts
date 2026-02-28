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
    const { publicId, transformations } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Build transformation URL
    const transformedUrl = cloudinary.url(publicId, {
      ...transformations,
      secure: true,
    });

    return NextResponse.json({ url: transformedUrl });
  } catch (error) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Failed to generate transformation URL' },
      { status: 500 }
    );
  }
}
