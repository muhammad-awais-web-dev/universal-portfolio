'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import { ExternalLink, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSearch } from '@/components/admin/admin-search';

// Map routes + params → human-readable page titles
function usePageTitle(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === '/protected' || pathname === '/protected/') return 'Dashboard';
  if (pathname === '/protected/media-library') return 'Media Library';
  if (pathname === '/protected/docs') return 'Documentation';

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

export function AdminTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const title = usePageTitle();

  return (
    <header className="h-14 shrink-0 border-b flex items-center justify-between px-4 sm:px-6 bg-background">
      <div className="flex items-center gap-3">
        {/* Hamburger — visible only on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-8 w-8"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <AdminSearch />
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
