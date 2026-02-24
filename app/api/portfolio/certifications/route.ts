import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { listCertifications, createCertification } from '@/lib/data/portfolio-repository';
import { certificationCreateSchema } from '@/lib/schemas/portfolio';

export async function GET() {
  try {
    const certifications = await listCertifications();
    return NextResponse.json({ certifications });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load certifications', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = certificationCreateSchema.parse(payload);
    const certification = await createCertification(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to create certification', details: (error as Error).message },
      { status }
    );
  }
}
