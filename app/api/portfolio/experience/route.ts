import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { listExperience, createExperience } from '@/lib/data/portfolio-repository';
import { experienceCreateSchema } from '@/lib/schemas/portfolio';

export async function GET() {
  try {
    const experience = await listExperience();
    return NextResponse.json({ experience });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load experience', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = experienceCreateSchema.parse(payload);
    const exp = await createExperience(parsed);
    return NextResponse.json({ experience: exp }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to create experience', details: (error as Error).message },
      { status }
    );
  }
}
