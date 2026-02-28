import { NextResponse } from 'next/server';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { getEducation, updateEducation, deleteEducation } from '@/lib/data/portfolio-repository';
import { educationUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ educationId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { educationId } = await params;
    const edu = await getEducation(Number(educationId));
    if (!edu) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ education: edu });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load education', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { educationId } = await params;
    const payload = await request.json();
    const parsed = educationUpdateSchema.parse({ ...payload, id: Number(educationId) });
    const edu = await updateEducation(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ education: edu });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update education', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { educationId } = await params;
    await deleteEducation(Number(educationId));
    revalidateTag(PORTFOLIO_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete education', details: (error as Error).message },
      { status: 500 }
    );
  }
}
