import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getSkill, updateSkill, deleteSkill } from '@/lib/data/portfolio-repository';
import { skillUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ skillId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { skillId } = await params;
    const skill = await getSkill(Number(skillId));
    if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load skill', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { skillId } = await params;
    const payload = await request.json();
    const parsed = skillUpdateSchema.parse({ ...payload, id: Number(skillId) });
    const skill = await updateSkill(parsed);
    return NextResponse.json({ skill });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update skill', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { skillId } = await params;
    await deleteSkill(Number(skillId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill', details: (error as Error).message },
      { status: 500 }
    );
  }
}
