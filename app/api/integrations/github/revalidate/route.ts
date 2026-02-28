import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, saveIntegration, markIntegrationError } from '@/lib/integrations/repository';
import type { GitHubConfig } from '@/lib/integrations/types';

export async function POST() {
  const authError = await requireAuth();
  if (authError) return authError;

  const integration = await getIntegration('github');
  if (!integration) return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });

  const cfg = integration.config as unknown as GitHubConfig;
  if (!cfg.username) return NextResponse.json({ error: 'No username stored' }, { status: 400 });

  try {
    const headers: Record<string, string> = { 'User-Agent': 'portfolio-app' };
    if (cfg.token) headers['Authorization'] = `Bearer ${cfg.token}`;

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cfg.username)}`, { headers });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    // Re-save with connected status
    await saveIntegration('github', integration.config as Record<string, string>);
    return NextResponse.json({ success: true });
  } catch (e) {
    markIntegrationError('github', (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
