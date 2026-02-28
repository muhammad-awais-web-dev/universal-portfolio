import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, disconnectIntegration, getIntegrationPublic } from '@/lib/integrations/repository';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  const integration = await getIntegration('github');
  if (!integration) return NextResponse.json(null);
  return NextResponse.json(getIntegrationPublic(integration));
}

export async function DELETE() {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await disconnectIntegration('github');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
