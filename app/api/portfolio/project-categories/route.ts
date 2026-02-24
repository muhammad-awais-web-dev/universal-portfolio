import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import {
  listProjectCategories,
  createProjectCategory,
} from '@/lib/data/portfolio-repository';

export async function GET() {
  try {
    const categories = await listProjectCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load project categories', details: (error as Error).message },
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
      revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ error: 'name is required' }, { status: 422 });
    }
    const category = await createProjectCategory(name);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project category', details: (error as Error).message },
      { status: 500 }
    );
  }
}
