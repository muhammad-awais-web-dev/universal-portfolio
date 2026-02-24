import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { listTestimonials, createTestimonial } from '@/lib/data/portfolio-repository';
import { testimonialCreateSchema } from '@/lib/schemas/portfolio';

export async function GET() {
  try {
    const testimonials = await listTestimonials();
    return NextResponse.json({ testimonials });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load testimonials', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const payload = await request.json();
    const parsed = testimonialCreateSchema.parse(payload);
    const testimonial = await createTestimonial(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to create testimonial', details: (error as Error).message },
      { status }
    );
  }
}
