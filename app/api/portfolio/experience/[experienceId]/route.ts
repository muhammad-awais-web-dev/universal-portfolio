import { NextResponse } from 'next/server';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { getExperience, updateExperience, deleteExperience } from '@/lib/data/portfolio-repository';
import { experienceUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ experienceId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { experienceId } = await params;
    const exp = await getExperience(Number(experienceId));
    if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ experience: exp });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load experience', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { experienceId } = await params;
    const payload = await request.json();
    const parsed = experienceUpdateSchema.parse({ ...payload, id: Number(experienceId) });
    const exp = await updateExperience(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ experience: exp });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update experience', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { experienceId } = await params;
    await deleteExperience(Number(experienceId));
    revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete experience', details: (error as Error).message },
      { status: 500 }
    );
  }
}
