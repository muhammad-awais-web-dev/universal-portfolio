import { NextResponse } from 'next/server';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

function buildXml(urls: { loc: string; lastmod: string; changefreq: string; priority: string }[]) {
  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: baseUrl, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/projects`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/certifications`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/education`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/experience`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
  ];

  let dynamicUrls: typeof staticUrls = [];

  try {
    const data = await getCachedPortfolio();

    const projectUrls = (data.projects || [])
      .filter((p) => p.is_published && p.slug)
      .map((p) => ({
        loc: `${baseUrl}/projects/${p.slug}`,
        lastmod: (p.updated_at || p.created_at || today).split('T')[0],
        changefreq: 'monthly',
        priority: '0.7',
      }));

    const certUrls = (data.certifications || [])
      .filter((c) => c.is_active !== false)
      .map((c) => ({
        loc: `${baseUrl}/certifications/${c.id}`,
        lastmod: (c.created_at || today).split('T')[0],
        changefreq: 'yearly',
        priority: '0.5',
      }));

    const eduUrls = (data.education || []).map((e) => ({
      loc: `${baseUrl}/education/${e.id}`,
      lastmod: (e.created_at || today).split('T')[0],
      changefreq: 'yearly',
      priority: '0.5',
    }));

    const expUrls = (data.experiences || []).map((e) => ({
      loc: `${baseUrl}/experience/${e.id}`,
      lastmod: (e.created_at || today).split('T')[0],
      changefreq: 'yearly',
      priority: '0.5',
    }));

    dynamicUrls = [...projectUrls, ...certUrls, ...eduUrls, ...expUrls];
  } catch {
    // fallback to static only
  }

  const xml = buildXml([...staticUrls, ...dynamicUrls]);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
