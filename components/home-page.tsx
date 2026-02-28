"use client";

import { useEffect, useState } from 'react';
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavBarWrapper } from "@/components/admin/navbar-wrapper";
import { EnvProcessValidator } from "@/components/setup/env-process-validator";
import { ComingSoonPage } from "@/components/coming-soon-page";
import { PublishedPortfolio } from "@/components/portfolio/published-portfolio";
import { useAdminSession } from "@/lib/hooks/useAdminSession";

interface HomePageProps {
  isAdmin: boolean;
  forceDevMode: boolean;
  missingVars: string[];
  isEmailConfigured?: boolean;
}

export default function HomePage({ forceDevMode, missingVars, isEmailConfigured = false }: HomePageProps) {
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn } = useAdminSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const effectiveIsAdmin = isLoggedIn;

  // ── Development mode (ENVIRONMENT=development or missing critical vars) ──
  if (forceDevMode) {
    // Missing critical env vars — show env dashboard to everyone
    if (missingVars.length > 0) {
      return (
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <NavBarWrapper />
            <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
              <EnvProcessValidator missingVars={missingVars} forceDevMode={forceDevMode} />
              <section className="text-center space-y-4 py-8 border rounded-lg p-6 bg-muted/50">
                <h2 className="text-2xl font-bold">Development Mode</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Configure the missing environment variables above, then remove{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">ENVIRONMENT=development</code>{' '}
                  (or set it to any other value) to publish your portfolio.
                </p>
              </section>
            </div>
            <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-16">
              <p>Portfolio — Development Mode</p>
              <ThemeSwitcher />
            </footer>
          </div>
        </main>
      );
    }

    // ENVIRONMENT=development, vars are fine — visitors see Coming Soon
    if (!effectiveIsAdmin) {
      return <ComingSoonPage />;
    }

    // Admin in dev mode sees the env dashboard
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <NavBarWrapper />
          <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
            <EnvProcessValidator missingVars={missingVars} forceDevMode={forceDevMode} />
            <section className="text-center space-y-4 py-8 border rounded-lg p-6 bg-muted/50">
              <h2 className="text-2xl font-bold">Development Mode</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your portfolio is live internally. Remove{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">ENVIRONMENT=development</code>{' '}
                from your environment variables (or set it to any other value) to publish.
              </p>
            </section>
          </div>
          <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-16">
            <p>Portfolio — Development Mode</p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    );
  }

  // ── Published mode ────────────────────────────────────────────────────────
  return <PublishedPortfolio isAdmin={effectiveIsAdmin} isEmailConfigured={isEmailConfigured} />;
}

