import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, saveIntegration, disconnectIntegration } from '@/lib/integrations/repository';
import type { CloudinaryConfig } from '@/lib/integrations/types';

export async function POST() {
  const authError = await requireAuth();
  if (authError) return authError;

  const integration = await getIntegration('cloudinary');
  if (!integration || integration.status === 'disconnected') {
    return NextResponse.json({ error: 'Cloudinary is not connected' }, { status: 400 });
  }

  const cfg = integration.config as Partial<CloudinaryConfig>;
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    await disconnectIntegration('cloudinary');
    return NextResponse.json({ error: 'Stored credentials are incomplete' }, { status: 400 });
  }

  try {
    cloudinary.config({ cloud_name: cfg.cloud_name, api_key: cfg.api_key, api_secret: cfg.api_secret });
    await cloudinary.api.ping();
    await saveIntegration('cloudinary', integration.config, 'connected');
    return NextResponse.json({ success: true, status: 'connected' });
  } catch (err) {
    await saveIntegration('cloudinary', integration.config, 'error');
    return NextResponse.json(
      { error: 'Validation failed', details: (err as Error).message, status: 'error' },
      { status: 400 }
    );
  }
}
