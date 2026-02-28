import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getIntegration, saveIntegration } from '@/lib/integrations/repository';
import type { GitHubConfig } from '@/lib/integrations/types';

/** PATCH — update feature toggles without re-validating credentials */
export async function PATCH(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const integration = await getIntegration('github');
  if (!integration || integration.status !== 'connected') {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
  }

  const updates = await request.json() as Partial<GitHubConfig>;
  const current = integration.config as unknown as GitHubConfig;

  const merged: GitHubConfig = {
    ...current,
    show_commit_chart: updates.show_commit_chart ?? current.show_commit_chart,
    show_top_languages: updates.show_top_languages ?? current.show_top_languages,
    show_contribution_graph: updates.show_contribution_graph ?? current.show_contribution_graph,
    show_pinned_repos: updates.show_pinned_repos ?? current.show_pinned_repos,
    show_stats: updates.show_stats ?? current.show_stats,
  };

  try {
    await saveIntegration('github', merged as unknown as Record<string, string>);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
