'use client';

import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { useAdminProfile } from '@/lib/hooks/useAdminProfile';
import { AdminNavBar } from './admin-header-bar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';

export function NavBarWrapper() {
  const { isLoggedIn, isChecking, logout } = useAdminSession();
  const { profile } = useAdminProfile(isLoggedIn);

  // While checking, show default navbar
  if (isChecking) {
    return (
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-1 items-center">
            <Link href={"/"} className="font-semibold mr-3">Portfolio</Link>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>
    );
  }

  // If logged in, show admin navbar
  if (isLoggedIn) {
    return <AdminNavBar profile={profile} onLogout={logout} />;
  }

  // Default public navbar
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-1 items-center">
          <Link href={"/"} className="font-semibold mr-3">Portfolio</Link>
          <Link href="/projects" className="hidden sm:block px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">Projects</Link>
          <Link href="/certifications" className="hidden sm:block px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">Certifications</Link>
          <Link href="/education" className="hidden sm:block px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">Education</Link>
          <Link href="/experience" className="hidden sm:block px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">Experience</Link>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
