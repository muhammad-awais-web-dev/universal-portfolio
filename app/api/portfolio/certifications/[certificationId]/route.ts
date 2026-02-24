import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { requireAuth } from '@/lib/auth/api-guard';
import { getCertification, updateCertification, deleteCertification } from '@/lib/data/portfolio-repository';
import { certificationUpdateSchema } from '@/lib/schemas/portfolio';

type Params = Promise<{ certificationId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { certificationId } = await params;
    const cert = await getCertification(Number(certificationId));
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ certification: cert });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load certification', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { certificationId } = await params;
    const payload = await request.json();
    const parsed = certificationUpdateSchema.parse({ ...payload, id: Number(certificationId) });
    const cert = await updateCertification(parsed);
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ certification: cert });
  } catch (error) {
    const status = error instanceof Error && error.name === 'ZodError' ? 422 : 500;
    return NextResponse.json(
      { error: 'Failed to update certification', details: (error as Error).message },
      { status }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { certificationId } = await params;
    await deleteCertification(Number(certificationId));
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete certification', details: (error as Error).message },
      { status: 500 }
    );
  }
}
