import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';
import { saveIntegration } from '@/lib/integrations/repository';

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const { cloud_name, api_key, api_secret } = body as {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
  };

  if (!cloud_name || !api_key || !api_secret) {
    return NextResponse.json({ error: 'cloud_name, api_key, and api_secret are required' }, { status: 400 });
  }

  // Validate by listing a folder (lightweight call)
  try {
    cloudinary.config({ cloud_name, api_key, api_secret });
    await cloudinary.api.ping();
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid Cloudinary credentials', details: (err as Error).message },
      { status: 400 }
    );
  }

  await saveIntegration('cloudinary', { cloud_name, api_key, api_secret }, 'connected');
  return NextResponse.json({ success: true });
}
