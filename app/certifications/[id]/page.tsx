import type { Metadata } from 'next';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { CertificationDetailClient } from '@/components/portfolio/certification-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedPortfolio();
  const cert = data?.certifications?.find((c) => String(c.id) === id);

  if (!cert) {
    return { title: 'Certification Not Found' };
  }

  const title = cert.title;
  const description = cert.authority
    ? `${title} — issued by ${cert.authority}.`
    : `View details about the ${title} certification.`;
  const image = cert.featured_image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export async function generateStaticParams() {
  const data = await getCachedPortfolio();
  return (data?.certifications || []).map((c) => ({ id: String(c.id) }));
}

export default async function CertificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CertificationDetailClient id={id} />;
}
