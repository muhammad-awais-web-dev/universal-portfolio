import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { saveIntegration } from '@/lib/integrations/repository';

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const { api_key, contact_email } = body as {
    api_key?: string;
    contact_email?: string;
  };

  if (!api_key || !contact_email) {
    return NextResponse.json({ error: 'api_key and contact_email are required' }, { status: 400 });
  }

  // Basic format validation — Resend keys start with 're_'
  // We skip a live API call because sending-only keys can't call management endpoints.
  // The key will be validated on first actual email send (markIntegrationError flags failures).
  if (!api_key.startsWith('re_')) {
    return NextResponse.json({ error: 'Invalid API key format — Resend keys start with re_' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact_email)) {
    return NextResponse.json({ error: 'Invalid contact email address' }, { status: 400 });
  }

  try {
    await saveIntegration('resend', { api_key, contact_email }, 'connected');
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to save integration', details: (err as Error).message },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true });
}
