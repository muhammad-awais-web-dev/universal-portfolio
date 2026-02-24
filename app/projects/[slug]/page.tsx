import type { Metadata } from 'next';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { ProjectDetailClient } from '@/components/portfolio/project-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedPortfolio();
  const project = data?.projects?.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const title = project.title;
  const description = project.short_description || project.description || `View details about ${title}.`;
  const image = project.featured_image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}
