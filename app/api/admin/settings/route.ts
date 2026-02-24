// Admin settings API — always reads live (no cache), writes invalidate Tier-2 cache
// GET  /api/admin/settings  — returns all current settings (live DB read)
// PATCH /api/admin/settings — saves partial updates + clears site-settings cache

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { getAllSettings, saveSetting } from '@/lib/settings/repository';
import { SETTINGS_CACHE_TAG } from '@/lib/settings/cached';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load settings', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const updates = await request.json();
    await saveSetting(updates);

    // Always clear the Tier-2 cache so public pages get fresh cosmetic settings
    revalidateTag(SETTINGS_CACHE_TAG, 'max');

    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save settings', details: (error as Error).message },
      { status: 500 }
    );
  }
}
