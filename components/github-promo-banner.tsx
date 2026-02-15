'use client';

import { useState, useEffect } from 'react';
import { X, Github, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BANNER_DISMISSED_KEY = 'github_promo_banner_dismissed';
const REPO_URL = 'https://github.com/muhammad-awais-web-dev/universal-portfolio';

export function GitHubPromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if banner was dismissed
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  const handleStarClick = () => {
    window.open(`${REPO_URL}/stargazers`, '_blank');
  };

  const handleRepoClick = () => {
    window.open(REPO_URL, '_blank');
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg border-2">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Github className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Open Source Project</h3>
              <p className="text-xs text-muted-foreground">Universal Portfolio</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          Like this portfolio builder? Give it a ⭐ on GitHub and help others discover it!
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1 gap-2"
            onClick={handleStarClick}
          >
            <Star className="h-3 w-3" />
            Star
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleRepoClick}
          >
            <ExternalLink className="h-3 w-3" />
            View Repo
          </Button>
        </div>
      </div>
    </Card>
  );
}
