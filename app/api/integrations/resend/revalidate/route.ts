import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, saveIntegration } from '@/lib/integrations/repository';
import type { ResendConfig } from '@/lib/integrations/types';

export async function POST() {
  const authError = await requireAuth();
  if (authError) return authError;

  const integration = await getIntegration('resend');
  if (!integration || integration.status === 'disconnected') {
    return NextResponse.json({ error: 'Resend is not connected' }, { status: 400 });
  }

  const cfg = integration.config as Partial<ResendConfig>;
  if (!cfg.api_key || !cfg.contact_email) {
    return NextResponse.json({ error: 'Stored credentials are incomplete' }, { status: 400 });
  }

  // Validate by sending a test email to the configured contact address
  try {
    const resend = new Resend(cfg.api_key);
    const { error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: cfg.contact_email,
      subject: 'Resend connection re-test',
      html: '<p>This is an automated re-test of your Resend integration.</p>',
    });
    if (error) throw new Error((error as { message?: string }).message || 'Send failed');
    await saveIntegration('resend', integration.config, 'connected');
    return NextResponse.json({ success: true, status: 'connected' });
  } catch (err) {
    await saveIntegration('resend', integration.config, 'error');
    return NextResponse.json(
      { error: 'Validation failed', details: (err as Error).message, status: 'error' },
      { status: 400 }
    );
  }
}
