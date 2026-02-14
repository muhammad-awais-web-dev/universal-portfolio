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
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>My Portfolio</Link>
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
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>My Portfolio</Link>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
