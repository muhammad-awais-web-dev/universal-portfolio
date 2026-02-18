import { MetadataRoute } from 'next';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/education`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/experience`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Try to fetch published projects for dynamic routes
  try {
    const res = await fetch(`${baseUrl}/api/portfolio`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const projectRoutes: MetadataRoute.Sitemap = (data.projects || [])
        .filter((p: any) => p.is_published && p.slug)
        .map((p: any) => ({
          url: `${baseUrl}/projects/${p.slug}`,
          lastModified: new Date(p.updated_at || p.created_at || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      return [...staticRoutes, ...projectRoutes];
    }
  } catch {
    // fallback to static routes only
  }

  return staticRoutes;
}
