'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Check } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url?: string;
}

// Simple inline SVG icons for social platforms
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Share on X / Twitter"
      >
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <TwitterIcon />
          <span className="sr-only">Share on X</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Share on LinkedIn"
      >
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
          <span className="sr-only">Share on LinkedIn</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Share on Facebook"
      >
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <FacebookIcon />
          <span className="sr-only">Share on Facebook</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 w-8 p-0"
        title="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Link2 className="h-3.5 w-3.5" />}
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  );
}
