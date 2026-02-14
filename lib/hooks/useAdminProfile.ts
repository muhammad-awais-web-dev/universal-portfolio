'use client';

import { useState, useEffect } from 'react';
import type { Profile } from '@/lib/models/portfolio';

export function useAdminProfile(isLoggedIn: boolean) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [isLoggedIn]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/portfolio/profile');
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refresh: loadProfile,
  };
}
