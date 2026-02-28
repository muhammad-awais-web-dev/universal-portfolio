'use client';

import Image from 'next/image';
import { LogoSettings } from '@/lib/settings/types';

const SIZE_MAP = { sm: 24, md: 32, lg: 40 };
const STYLE_MAP = { circle: 'rounded-full', rounded: 'rounded-md', square: 'rounded-none' };

interface LogoDisplayProps {
  logo: LogoSettings;
  /** Fallback text when logo.text is null (usually profile name) */
  fallbackText?: string;
  className?: string;
}

export function LogoDisplay({ logo, fallbackText = 'Portfolio', className = '' }: LogoDisplayProps) {
  const px = SIZE_MAP[logo.size ?? 'md'];
  const imgClass = `shrink-0 object-contain ${STYLE_MAP[logo.style ?? 'rounded']}`;
  const text = logo.text ?? fallbackText;
  const showImage = !!logo.url && logo.layout !== 'text-only';
  const showText = logo.layout !== 'image-only';

  if (logo.layout === 'image-text-below') {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {showImage && (
          <Image src={logo.url!} alt={text} width={px} height={px} className={imgClass} unoptimized />
        )}
        {showText && <span className="font-semibold text-sm leading-tight">{text}</span>}
      </div>
    );
  }

  // image-text-side (default), image-only, text-only
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showImage && (
        <Image src={logo.url!} alt={text} width={px} height={px} className={imgClass} unoptimized />
      )}
      {showText && <span className="font-semibold">{text}</span>}
    </div>
  );
}
