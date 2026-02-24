import { NextResponse } from 'next/server';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import {
  listSkillCategories,
  createSkillCategory,
} from '@/lib/data/portfolio-repository';

export async function GET() {
  try {
    const categories = await listSkillCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load skill categories', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ error: 'name is required' }, { status: 422 });
    }
    const category = await createSkillCategory(name);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create skill category', details: (error as Error).message },
      { status: 500 }
    );
  }
}
