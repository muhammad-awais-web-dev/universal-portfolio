import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';
import { getCloudinaryConfig } from '@/lib/integrations/cloudinary-config';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const cfg = await getCloudinaryConfig();
  if (!cfg) return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 });
  cloudinary.config({ cloud_name: cfg.cloud_name, api_key: cfg.api_key, api_secret: cfg.api_secret });

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'portfolio';
    const maxResults = parseInt(searchParams.get('max_results') || '50');

    // List images from Cloudinary folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      resource_type: 'image',
    });

    return NextResponse.json({
      resources: result.resources.map((resource: CloudinaryResource) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        created_at: resource.created_at,
      })),
    });
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}
