import { NextResponse } from 'next/server';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import {
  updateSkillCategory,
  deleteSkillCategory,
} from '@/lib/data/portfolio-repository';

type Params = Promise<{ categoryId: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { categoryId } = await params;
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ error: 'name is required' }, { status: 422 });
    }
    const category = await updateSkillCategory(Number(categoryId), name);
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update skill category', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { categoryId } = await params;
    await deleteSkillCategory(Number(categoryId));
    revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill category', details: (error as Error).message },
      { status: 500 }
    );
  }
}
