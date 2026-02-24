import type { Metadata } from 'next';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { ExperienceDetailClient } from '@/components/portfolio/experience-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedPortfolio();
  const exp = data?.experience?.find((e) => String(e.id) === id);

  if (!exp) {
    return { title: 'Experience Not Found' };
  }

  const title = `${exp.title} at ${exp.company}`;
  const description = exp.description
    ? exp.description.slice(0, 160)
    : `${exp.title} role at ${exp.company}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExperienceDetailClient id={id} />;
}
