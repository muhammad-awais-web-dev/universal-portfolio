import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { getTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/data/portfolio-repository';
import { testimonialUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ testimonialId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { testimonialId } = await params;
    const testimonial = await getTestimonial(Number(testimonialId));
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load testimonial', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { testimonialId } = await params;
    const payload = await request.json();
    const parsed = testimonialUpdateSchema.parse({ ...payload, id: Number(testimonialId) });
    const testimonial = await updateTestimonial(parsed);
    return NextResponse.json({ testimonial });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update testimonial', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { testimonialId } = await params;
    await deleteTestimonial(Number(testimonialId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete testimonial', details: (error as Error).message },
      { status: 500 }
    );
  }
}
