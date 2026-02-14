'use client';

import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { useAdminProfile } from '@/lib/hooks/useAdminProfile';
import { AdminHeaderBar } from './admin-header-bar';

export function AdminHeaderProvider() {
  const { isLoggedIn, isChecking, logout } = useAdminSession();
  const { profile } = useAdminProfile(isLoggedIn);

  // Don't render anything while checking session
  if (isChecking) {
    return null;
  }

  // Only show header when logged in
  if (!isLoggedIn) {
    return null;
  }

  return <AdminHeaderBar profile={profile} onLogout={logout} />;
}
