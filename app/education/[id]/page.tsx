import { EducationDetailClient } from '@/components/portfolio/education-detail-client';

export default async function EducationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EducationDetailClient id={id} />;
}
