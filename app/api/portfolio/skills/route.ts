import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { listSkills, createSkill } from '@/lib/data/portfolio-repository';
import { skillCreateSchema } from '@/lib/schemas/portfolio';

export async function GET() {
  try {
    const skills = await listSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load skills', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = skillCreateSchema.parse(payload);
    const skill = await createSkill(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to create skill', details: (error as Error).message },
      { status }
    );
  }
}
