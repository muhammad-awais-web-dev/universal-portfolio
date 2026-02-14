'use client';

import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { useAdminProfile } from '@/lib/hooks/useAdminProfile';
import { AdminNavBar } from './admin-header-bar';

export function AdminNavProvider() {
  const { isLoggedIn, isChecking, logout } = useAdminSession();
  const { profile } = useAdminProfile(isLoggedIn);

  // Don't render anything while checking session
  if (isChecking) {
    return null;
  }

  // Only show nav bar when logged in
  if (!isLoggedIn) {
    return null;
  }

  return <AdminNavBar profile={profile} onLogout={logout} />;
}
