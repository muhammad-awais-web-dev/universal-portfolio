import { ExperienceDetailClient } from '@/components/portfolio/experience-detail-client';

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExperienceDetailClient id={id} />;
}
