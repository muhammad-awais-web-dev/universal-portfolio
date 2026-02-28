'use client';

import { useState } from 'react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { usePublicSettings } from '@/lib/hooks/usePublicSettings';
import { LogoDisplay } from '@/components/portfolio/logo-display';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/education', label: 'Education' },
  { href: '/experience', label: 'Experience' },
];

export function NavBarWrapper() {
  const { isChecking } = useAdminSession();
  const { settings } = usePublicSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  const brandFallback = settings.website_name || 'Portfolio';

  // While checking auth, show minimal navbar skeleton
  if (isChecking) {
    return (
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href="/">
            <LogoDisplay logo={settings.logo} fallbackText={brandFallback} />
          </Link>
          <ThemeSwitcher />
        </div>
      </nav>
    );
  }

  // Public navbar
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10">
      <div className="w-full max-w-5xl p-3 px-5 text-sm">
        <div className="flex justify-between items-center h-10">
          <div className="flex gap-1 items-center">
            <Link href="/" className="mr-3">
              <LogoDisplay logo={settings.logo} fallbackText={brandFallback} />
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden sm:block px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              className="sm:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden py-2 border-t mt-2 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

