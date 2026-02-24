import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { deleteProject, getProject, updateProject } from '@/lib/data/portfolio-repository';
import { projectUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ projectId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { projectId } = await params;
    const project = await getProject(Number(projectId));
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { projectId } = await params;
    const payload = await request.json();
    const parsed = projectUpdateSchema.parse({ ...payload, id: Number(projectId) });
    const project = await updateProject(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ project });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update project', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { projectId } = await params;
    await deleteProject(Number(projectId));
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project', details: (error as Error).message },
      { status: 500 }
    );
  }
}
