import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, getIntegrationPublic, disconnectIntegration } from '@/lib/integrations/repository';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const integration = await getIntegration('resend');
  if (!integration) {
    return NextResponse.json({ key: 'resend', status: 'disconnected', masked: {}, error_message: null, connected_at: null, updated_at: '' });
  }
  return NextResponse.json(getIntegrationPublic(integration));
}

export async function DELETE() {
  const authError = await requireAuth();
  if (authError) return authError;

  await disconnectIntegration('resend');
  return NextResponse.json({ success: true });
}
