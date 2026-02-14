"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavBarWrapper } from "@/components/admin/navbar-wrapper";
import { EnvStatusDashboard } from "@/components/setup/env-status-dashboard";
import { ComingSoonPage } from "@/components/coming-soon-page";
import { checkEnvStatus } from "@/lib/setup/env-checker";
import { getSettings, type PortfolioSettings } from "@/lib/settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HomePageProps {
  isAdmin: boolean;
  forceDevMode: boolean;
  missingVars: string[];
}

export default function HomePage({ isAdmin, forceDevMode, missingVars }: HomePageProps) {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [mounted, setMounted] = useState(false);
  const envStatus = checkEnvStatus();

  useEffect(() => {
    // Set flag for critical env vars check
    if (forceDevMode && typeof window !== 'undefined') {
      (window as any).__CRITICAL_ENV_MISSING = true;
    }
    
    setSettings(getSettings());
    setMounted(true);
  }, [forceDevMode]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  // Determine actual mode (forced to dev if critical vars missing)
  const actualMode = forceDevMode ? 'development' : (settings?.mode || 'development');

  // Show development mode
  if (actualMode === 'development') {
    // Non-admin users see "Coming Soon"
    if (!isAdmin) {
      return <ComingSoonPage />;
    }

    // Admin users see environment dashboard
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <NavBarWrapper />
          <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
            {forceDevMode && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development mode is auto-enforced.</strong> Critical environment variables are missing: {missingVars.join(', ')}. 
                  Configure these variables to enable published mode.
                </AlertDescription>
              </Alert>
            )}
            
            <EnvStatusDashboard status={envStatus} />
            
            <section className="text-center space-y-4 py-8 border rounded-lg p-6 bg-muted/50">
              <h2 className="text-2xl font-bold">Development Mode</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your portfolio is in development mode. The environment checker above shows the status 
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
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <NavBarWrapper />
        <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
          {/* Hero Section */}
          <section className="text-center space-y-6 py-12">
            <h1 className="text-5xl font-bold tracking-tight">
              {settings?.websiteName || 'Welcome to My Portfolio'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my projects, skills, certifications, and experience.
              This portfolio showcases my professional journey and technical expertise.
            </p>
          </section>

          {/* Featured Content Sections */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📁 Projects</h3>
              <p className="text-sm text-muted-foreground">
                Browse my portfolio of projects showcasing web development,
                design, and technical innovation.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛠️ Skills</h3>
              <p className="text-sm text-muted-foreground">
                Discover the technologies and tools I work with, from frontend
                frameworks to backend systems.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏆 Certifications</h3>
              <p className="text-sm text-muted-foreground">
                View my professional certifications and credentials that validate
                my expertise.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 Experience</h3>
              <p className="text-sm text-muted-foreground">
                Learn about my professional experience and the companies I've
                worked with.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎓 Education</h3>
              <p className="text-sm text-muted-foreground">
                Explore my educational background and academic achievements.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📧 Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch via email or connect with me on social media
                platforms.
              </p>
            </div>
          </section>

          {/* Note: Actual portfolio data will be loaded here in future implementation */}
          <section className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Portfolio content coming soon. Data will be loaded from the management system.
            </p>
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>{settings?.websiteName || 'Personal Portfolio Website'}</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
