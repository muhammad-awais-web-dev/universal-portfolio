'use client';

import { Suspense, useState } from 'react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { useAdminProfile } from '@/lib/hooks/useAdminProfile';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopBar } from '@/components/admin/admin-top-bar';
import { GitHubPromoBanner } from '@/components/github-promo-banner';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isChecking, logout } = useAdminSession();
  const { profile } = useAdminProfile(isLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // While checking auth or not logged in, render children directly (login page)
  if (isChecking || !isLoggedIn) {
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
            {children}
          </div>
        </div>
        <GitHubPromoBanner />
      </main>
    );
  }

  // Logged in: full sidebar layout
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile unless open */}
      <Suspense fallback={null}>
        <AdminSidebar
          profile={profile}
          onLogout={logout}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </Suspense>

      {/* Right: top bar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Suspense fallback={<div className="h-14 border-b shrink-0" />}>
          <AdminTopBar onMenuToggle={() => setMobileMenuOpen((o) => !o)} />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <GitHubPromoBanner />
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

