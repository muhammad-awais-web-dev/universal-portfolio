// Public settings endpoint — returns Tier-2 cached settings (logo, favicon, website_name, mcp_enabled)
// No auth required. Cached by Next.js for 5 minutes, invalidated when admin saves settings.
// Used by client components (navbar) that can't read server-side directly.

import { NextResponse } from 'next/server';
import { getCachedPublicSettings, getDefaultPublicSettings } from '@/lib/settings/cached';

export async function GET() {
  try {
    const settings = await getCachedPublicSettings();
    return NextResponse.json(settings, {
      headers: {
        // Allow CDN/browser to cache for 5 minutes too
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch {
    // Return defaults if DB is unreachable — never error on a public route
    return NextResponse.json(getDefaultPublicSettings());
  }
}
