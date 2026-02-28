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
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, cfg.api_secret);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
