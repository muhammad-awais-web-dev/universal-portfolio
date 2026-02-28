import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getAllIntegrations } from '@/lib/integrations/repository';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const integrations = await getAllIntegrations();
  return NextResponse.json({ integrations });
}
