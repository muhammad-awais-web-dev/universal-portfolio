"use client";

import { useEffect, useState } from 'react';
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavBarWrapper } from "@/components/admin/navbar-wrapper";
import { EnvProcessValidator } from "@/components/setup/env-process-validator";
import { ComingSoonPage } from "@/components/coming-soon-page";
import { PublishedPortfolio } from "@/components/portfolio/published-portfolio";
import { getSettings, type PortfolioSettings } from "@/lib/settings";
import { useAdminSession } from "@/lib/hooks/useAdminSession";

interface HomePageProps {
  isAdmin: boolean;
  forceDevMode: boolean;
  missingVars: string[];
}

export default function HomePage({ isAdmin, forceDevMode, missingVars }: HomePageProps) {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [mounted, setMounted] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const { isLoggedIn, isChecking } = useAdminSession();

  useEffect(() => {
    // Set flag for critical env vars check
    if (forceDevMode && typeof window !== 'undefined') {
      (window as any).__CRITICAL_ENV_MISSING = true;
    }
    
    setSettings(getSettings());
    setMounted(true);

    // Check if email is configured
    fetch('/api/test-email', { method: 'HEAD' })
      .then(res => setEmailConfigured(res.ok))
      .catch(() => setEmailConfigured(false));
  }, [forceDevMode]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  // Use client-side session check (isLoggedIn) instead of server-side isAdmin
  const effectiveIsAdmin = isLoggedIn;

  // Determine actual mode (forced to dev if critical vars missing)
  const actualMode = forceDevMode ? 'development' : (settings?.mode || 'development');

  // Show development mode
  if (actualMode === 'development') {
    // If critical env vars are missing (forceDevMode), show env dashboard regardless of admin status
    // This allows users to see what needs to be configured
    if (forceDevMode) {
      return (
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <NavBarWrapper />
            <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
              <EnvProcessValidator 
                missingVars={missingVars}
                forceDevMode={forceDevMode}
              />
              
              <section className="text-center space-y-4 py-8 border rounded-lg p-6 bg-muted/50">
                <h2 className="text-2xl font-bold">Development Mode</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your portfolio is in development mode. The environment validator above shows the status 
                  of your configuration. Configure the missing environment variables to proceed.
                </p>
              </section>
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p>Personal Portfolio Website - Development Mode</p>
              <ThemeSwitcher />
            </footer>
          </div>
        </main>
      );
    }
    
    // Non-admin users see "Coming Soon"
    if (!effectiveIsAdmin) {
      return <ComingSoonPage />;
    }

    // Admin users see environment dashboard
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <NavBarWrapper />
          <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
            <EnvProcessValidator 
              missingVars={missingVars}
              forceDevMode={forceDevMode}
            />
            
            <section className="text-center space-y-4 py-8 border rounded-lg p-6 bg-muted/50">
              <h2 className="text-2xl font-bold">Development Mode</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your portfolio is in development mode. The environment validator above shows the status 
                of your configuration. Switch to "Published" mode in Settings when ready to go live.
              </p>
            </section>
          </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>Personal Portfolio Website - Development Mode</p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    );
  }

  // Show published mode (actual portfolio)
  return <PublishedPortfolio isAdmin={effectiveIsAdmin} isEmailConfigured={emailConfigured} />;
}

