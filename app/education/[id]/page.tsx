import type { Metadata } from 'next';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { EducationDetailClient } from '@/components/portfolio/education-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedPortfolio();
  const edu = data?.education?.find((e) => String(e.id) === id);

  if (!edu) {
    return { title: 'Education Not Found' };
  }

  const title = edu.degree ? `${edu.degree} — ${edu.institution}` : edu.institution;
  const description = edu.field_of_study
    ? `${edu.field_of_study} at ${edu.institution}.`
    : `Education at ${edu.institution}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary', title, description },
  };
}

export default async function EducationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EducationDetailClient id={id} />;
}
