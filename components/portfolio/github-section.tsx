'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Star, GitFork, Users, BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { GitHubStats } from '@/app/api/github/route';

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) return null;

  const { user, total_stars, total_forks, total_repos, top_languages, pinned_repos, features, username } = stats;

  const hasContent =
    (features.show_stats) ||
    (features.show_top_languages && top_languages.length > 0) ||
    (features.show_pinned_repos && pinned_repos.length > 0) ||
    features.show_contribution_graph;

  if (!hasContent) return null;

  return (
    <section className="border-t">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Github className="w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">GitHub</h2>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>

        {/* Stats row */}
        {features.show_stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Repositories', value: total_repos },
              { icon: Star, label: 'Stars Earned', value: total_stars },
              { icon: GitFork, label: 'Forks', value: total_forks },
              { icon: Users, label: 'Followers', value: user.followers },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="border rounded-xl p-4 text-center bg-muted/30">
                <Icon className="w-5 h-5 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contribution graph */}
        {features.show_contribution_graph && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contribution Activity</h3>
            <div className="border rounded-xl p-4 overflow-x-auto bg-muted/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/${username}`}
                alt={`${username}'s GitHub contribution chart`}
                className="w-full min-w-[600px] h-auto dark:invert dark:brightness-75"
              />
            </div>
          </div>
        )}

        {/* Top languages */}
        {features.show_top_languages && top_languages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Languages</h3>
            <div className="space-y-2">
              {/* Bar */}
              <div className="flex h-3 rounded-full overflow-hidden">
                {top_languages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                    title={`${lang.name}: ${lang.percent}%`}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {top_languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1.5 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pinned / top repos */}
        {features.show_pinned_repos && pinned_repos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pinned_repos.map((repo) => (
                <a
                  key={repo.full_name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border rounded-xl p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
                  )}

                  <div className="flex items-center gap-3 mt-auto text-xs text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#8b949e' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count}
                      </span>
                    )}
                  </div>

                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* View profile link */}
        <div className="flex justify-center pt-2">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-lg px-4 py-2 hover:bg-muted/40"
          >
            <Github className="w-4 h-4" />
            View full profile on GitHub
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C#': '#178600',
  'C++': '#f34b7d', C: '#555555', PHP: '#4F5D95', Ruby: '#701516',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883',
};
