import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { listEducation, createEducation } from '@/lib/data/portfolio-repository';
import { educationCreateSchema } from '@/lib/schemas/portfolio';

export async function GET() {
  try {
    const education = await listEducation();
    return NextResponse.json({ education });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load education', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = educationCreateSchema.parse(payload);
    const edu = await createEducation(parsed);
    return NextResponse.json({ education: edu }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to create education', details: (error as Error).message },
      { status }
    );
  }
}
