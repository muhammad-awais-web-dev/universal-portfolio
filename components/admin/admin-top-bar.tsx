'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// Map routes + params → human-readable page titles
function usePageTitle(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === '/protected' || pathname === '/protected/') return 'Dashboard';
  if (pathname === '/protected/media-library') return 'Media Library';

  if (pathname === '/protected/manage') {
    const section = searchParams.get('section') || 'bio';
    const labels: Record<string, string> = {
      bio: 'Bio & Profile',
      projects: 'Projects',
      skills: 'Skills',
      certifications: 'Certifications',
      experience: 'Experience',
      education: 'Education',
      testimonials: 'Testimonials',
    };
    return labels[section] ?? 'Content';
  }

  if (pathname === '/protected/settings') {
    const tab = searchParams.get('tab') || 'general';
    const labels: Record<string, string> = {
      general: 'General Settings',
      'api-keys': 'API Keys',
      credentials: 'Credentials',
      database: 'Database',
    };
    return labels[tab] ?? 'Settings';
  }

  return 'Admin';
}

export function AdminTopBar() {
  const title = usePageTitle();

  return (
    <header className="h-14 shrink-0 border-b flex items-center justify-between px-6 bg-background">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View Site
          <ExternalLink className="h-3 w-3" />
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
