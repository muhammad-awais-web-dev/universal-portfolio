import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
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

  // Validate by fetching Resend account info (lightweight API call)
  try {
    const resend = new Resend(api_key);
    // Use domains list as a lightweight validation ping
    const { error } = await resend.domains.list();
    if (error) throw new Error(error.message);
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid Resend API key', details: (err as Error).message },
      { status: 400 }
    );
  }

  await saveIntegration('resend', { api_key, contact_email }, 'connected');
  return NextResponse.json({ success: true });
}
