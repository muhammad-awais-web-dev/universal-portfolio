import { NextResponse } from 'next/server';
import { getIntegration } from '@/lib/integrations/repository';
import type { GitHubConfig } from '@/lib/integrations/types';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
}

export interface GitHubStats {
  user: GitHubUser;
  total_stars: number;
  total_forks: number;
  total_repos: number;
  top_languages: { name: string; percent: number; color: string }[];
  pinned_repos: GitHubRepo[];
  features: Pick<GitHubConfig, 'show_commit_chart' | 'show_top_languages' | 'show_contribution_graph' | 'show_pinned_repos' | 'show_stats'>;
  username: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C#': '#178600',
  'C++': '#f34b7d', C: '#555555', PHP: '#4F5D95', Ruby: '#701516',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883',
};

export async function GET() {
  const integration = await getIntegration('github');
  if (!integration || integration.status !== 'connected') {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 404 });
  }

  const cfg = integration.config as unknown as GitHubConfig;
  const { username, token } = cfg;

  const headers: HeadersInit = { 'User-Agent': 'portfolio-app', Accept: 'application/vnd.github.v3+json' };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  try {
    // Fetch user + repos in parallel
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers, cache: 'no-store' }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers, cache: 'no-store' }),
    ]);

    if (!userRes.ok) return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });

    const user: GitHubUser = await userRes.json();
    const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

    // Aggregate stats
    const nonForks = repos.filter((r) => !r.fork);
    const total_stars = nonForks.reduce((s, r) => s + r.stargazers_count, 0);
    const total_forks = nonForks.reduce((s, r) => s + r.forks_count, 0);

    // Top languages by repo count
    const langCount: Record<string, number> = {};
    for (const repo of nonForks) {
      if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
    }
    const total = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const top_languages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / total) * 100),
        color: LANG_COLORS[name] ?? '#8b949e',
      }));

    // Top repos by stars as "pinned" fallback
    const pinned_repos = [...nonForks]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const stats: GitHubStats = {
      user,
      total_stars,
      total_forks,
      total_repos: nonForks.length,
      top_languages,
      pinned_repos,
      features: {
        show_commit_chart: cfg.show_commit_chart ?? true,
        show_top_languages: cfg.show_top_languages ?? true,
        show_contribution_graph: cfg.show_contribution_graph ?? true,
        show_pinned_repos: cfg.show_pinned_repos ?? true,
        show_stats: cfg.show_stats ?? true,
      },
      username,
    };

    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
