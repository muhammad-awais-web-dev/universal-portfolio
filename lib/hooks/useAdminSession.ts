'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  isLoggedIn: boolean;
  isChecking: boolean;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession>({
    isLoggedIn: false,
    isChecking: true,
  });
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSession({
        isLoggedIn: data.isLoggedIn || false,
        isChecking: false,
      });
    } catch (error) {
      setSession({
        isLoggedIn: false,
        isChecking: false,
      });
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setSession({
          isLoggedIn: false,
          isChecking: false,
        });
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    ...session,
    logout,
    refresh: checkSession,
  };
}
