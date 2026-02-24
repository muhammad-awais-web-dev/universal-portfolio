import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { getProfile, upsertProfile } from '@/lib/data/portfolio-repository';
import { profileSchema } from '@/lib/schemas/portfolio';
import { withPortfolioGuard } from '@/lib/auth/portfolio-guard';

async function handleGET(_request: NextRequest) {
  try {
    const profile = await getProfile();
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load profile', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export const GET = withPortfolioGuard(handleGET);

export async function PUT(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = profileSchema.parse(payload);
    const profile = await upsertProfile(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ profile });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update profile', details: (error as Error).message },
      { status }
    );
  }
}
