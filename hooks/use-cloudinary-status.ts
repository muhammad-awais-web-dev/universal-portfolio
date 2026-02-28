'use client';

import { useState, useEffect } from 'react';

type CloudinaryStatus = 'loading' | 'connected' | 'disconnected';

/**
 * Returns the Cloudinary integration status from the server.
 * Uses the /api/integrations endpoint (already auth-protected).
 */
export function useCloudinaryStatus(): CloudinaryStatus {
  const [status, setStatus] = useState<CloudinaryStatus>('loading');

  useEffect(() => {
    fetch('/api/integrations')
      .then((r) => r.json())
      .then((data: Array<{ key: string; status: string }>) => {
        const cld = data.find((i) => i.key === 'cloudinary');
        setStatus(cld?.status === 'connected' ? 'connected' : 'disconnected');
      })
      .catch(() => setStatus('disconnected'));
  }, []);

  return status;
}
