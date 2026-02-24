import { ImageResponse } from 'next/og';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCachedPortfolio();
  const project = data?.projects?.find((p) => p.slug === slug);

  const title = project?.title ?? 'Project';
  const description = project?.short_description ?? project?.description ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: 16,
          }}
        >
          Portfolio Project
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            color: '#f8fafc',
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: 800,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
            }}
          >
            {description.slice(0, 140)}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
