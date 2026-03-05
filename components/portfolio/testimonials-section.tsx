'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Testimonial } from '@/lib/models/portfolio';

const MAX_LEN = 220;

function truncate(text: string): { short: string; truncated: boolean } {
  if (text.length <= MAX_LEN) return { short: text, truncated: false };
  return { short: text.slice(0, MAX_LEN).trimEnd() + '…', truncated: true };
}

function TestimonialCard({
  t,
  onReadMore,
}: {
  t: Testimonial;
  onReadMore: (t: Testimonial) => void;
}) {
  const { short, truncated } = truncate(t.comment);
  return (
    <div className="border rounded-lg p-5 bg-card flex flex-col gap-3 h-full">
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
        &ldquo;{short}&rdquo;
        {truncated && (
          <button
            onClick={() => onReadMore(t)}
            className="ml-1 text-xs text-primary underline-offset-2 hover:underline not-italic font-medium"
          >
            Read more
          </button>
        )}
      </p>
      <div className="flex items-center gap-3 pt-2 border-t">
        {t.image_url ? (
          <Image
            src={t.image_url}
            alt={t.name}
            width={36}
            height={36}
            className="rounded-full object-contain shrink-0"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-semibold">
            {t.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{t.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {t.position}
            {t.company ? `, ${t.company}` : ''}
          </p>
        </div>
        {t.platform_name && (
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            {t.platform_name}
          </span>
        )}
      </div>
    </div>
  );
}

function TestimonialModal({
  t,
  onClose,
}: {
  t: Testimonial;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-xl p-6 max-w-lg w-full relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
          &ldquo;{t.comment}&rdquo;
        </p>

        <div className="flex items-center gap-3 pt-3 border-t">
          {t.image_url ? (
            <Image
              src={t.image_url}
              alt={t.name}
              width={40}
              height={40}
              className="rounded-full object-contain shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-semibold">
              {t.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">
              {t.position}
              {t.company ? `, ${t.company}` : ''}
            </p>
          </div>
          {t.platform_name && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {t.platform_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const useCarousel = testimonials.length > 3;
  const cardWidth = 320; // px — matches min-w below
  const gap = 20; // px — gap-5 = 20px

  const maxIndex = Math.max(0, testimonials.length - 1);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const offset = currentIndex * (cardWidth + gap);

  return (
    <>
      {useCarousel ? (
        <div className="relative">
          {/* Carousel track */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-5 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} style={{ minWidth: `${cardWidth}px` }}>
                  <TestimonialCard t={t} onReadMore={setSelected} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full border bg-card hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === currentIndex
                      ? 'w-4 bg-primary'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="p-2 rounded-full border bg-card hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} onReadMore={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <TestimonialModal t={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
