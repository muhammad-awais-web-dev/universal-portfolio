import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { saveIntegration } from '@/lib/integrations/repository';
import type { GitHubConfig } from '@/lib/integrations/types';

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json() as Partial<GitHubConfig>;
  const { username, token, repo, show_commit_chart, show_top_languages, show_contribution_graph, show_pinned_repos, show_stats } = body;

  if (!username?.trim()) {
    return NextResponse.json({ error: 'GitHub username is required' }, { status: 400 });
  }

  // Validate by hitting the GitHub API
  try {
    const headers: Record<string, string> = { 'User-Agent': 'portfolio-app' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    if (!res.ok) {
      if (res.status === 401) return NextResponse.json({ error: 'Invalid GitHub token' }, { status: 400 });
      if (res.status === 404) return NextResponse.json({ error: 'GitHub user not found' }, { status: 400 });
      return NextResponse.json({ error: `GitHub API error: ${res.status}` }, { status: 400 });
    }

    const config: GitHubConfig = {
      username: username.trim(),
      ...(token ? { token } : {}),
      ...(repo ? { repo: repo.trim() } : {}),
      show_commit_chart: show_commit_chart ?? true,
      show_top_languages: show_top_languages ?? true,
      show_contribution_graph: show_contribution_graph ?? true,
      show_pinned_repos: show_pinned_repos ?? true,
      show_stats: show_stats ?? true,
    };

    await saveIntegration('github', config as unknown as Record<string, string>);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to connect', details: (e as Error).message }, { status: 500 });
  }
}
