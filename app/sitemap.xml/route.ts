import { NextResponse } from 'next/server';

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
    const res = await fetch(`${baseUrl}/api/portfolio`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      dynamicUrls = (data.projects || [])
        .filter((p: any) => p.is_published && p.slug)
        .map((p: any) => ({
          loc: `${baseUrl}/projects/${p.slug}`,
          lastmod: (p.updated_at || p.created_at || today).split('T')[0],
          changefreq: 'monthly',
          priority: '0.7',
        }));
    }
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
