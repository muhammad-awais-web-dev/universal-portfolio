'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Image as ImageIcon,
  Trash2,
  Copy,
  Search,
  Loader2,
  Check,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useCloudinaryStatus } from '@/hooks/use-cloudinary-status';
import Link from 'next/link';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

const FOLDERS = [
  'portfolio/avatars',
  'portfolio/projects',
  'portfolio/projects/gallery',
  'portfolio/skills',
  'portfolio/certifications',
  'portfolio/certifications/gallery',
  'portfolio/testimonials',
  'settings',
];

export default function MediaLibraryPage() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const cloudinaryStatus = useCloudinaryStatus();

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        FOLDERS.map((folder) =>
          fetch(`/api/cloudinary/list?folder=${folder}&max_results=200`)
            .then((r) => r.json())
            .then((d) => (d.resources || []) as CloudinaryImage[])
        )
      );
      const all: CloudinaryImage[] = [];
      results.forEach((r) => {
        if (r.status === 'fulfilled') all.push(...r.value);
      });
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setImages(all);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setDeleting(publicId);
    setDeleteError(null);
    try {
      const res = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds: [publicId] }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    } catch (e) {
      setDeleteError((e as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  // Derive active folders from known folder list (those that have images)
  const activeFolders = FOLDERS.filter((folder) =>
    images.some((img) => img.public_id.startsWith(folder + '/'))
  );

  // Label: strip leading 'portfolio/' for display
  const folderLabel = (f: string) =>
    f.startsWith('portfolio/') ? f.slice('portfolio/'.length) : f;

  const filtered = images.filter((img) => {
    const matchesFolder =
      folderFilter === 'all' || img.public_id.startsWith(folderFilter + '/');
    const matchesSearch =
      !searchTerm || img.public_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Cloudinary not connected banner */}
      {cloudinaryStatus === 'disconnected' && (
        <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950/30">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-700 dark:text-orange-400">
              Cloudinary is not connected. Connect it to upload and manage images.
            </span>
            <Link href="/protected/integrations">
              <button className="ml-4 text-sm font-medium text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:no-underline whitespace-nowrap">
                Go to Integrations →
              </button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Folder filter pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFolderFilter('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              folderFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({images.length})
          </button>
          {activeFolders.map((folder) => {
            const count = images.filter((i) => i.public_id.startsWith(folder + '/')).length;
            return (
              <button
                key={folder}
                onClick={() => setFolderFilter(folder)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  folderFilter === folder
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {folderLabel(folder)} ({count})
              </button>
            );
          })}
        </div>

        <Button variant="ghost" size="sm" onClick={loadImages} disabled={loading} className="ml-auto gap-1.5 h-9">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {deleteError && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <ImageIcon className="h-10 w-10" />
          <p className="text-sm">
            {searchTerm || folderFilter !== 'all' ? 'No images match your filters' : 'No images uploaded yet'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((image) => {
            const filename = image.public_id.split('/').pop() ?? image.public_id;
            // Find the known folder this image belongs to, strip 'portfolio/' prefix for display
            const matchedFolder = FOLDERS.find((f) => image.public_id.startsWith(f + '/')) ?? '';
            const folderBadge = folderLabel(matchedFolder) || image.public_id.split('/')[0];
            const isCopied = copied === image.secure_url;
            const isDeleting = deleting === image.public_id;

            return (
              <Card key={image.public_id} className="overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-square bg-muted relative">
                  <Image
                    src={image.secure_url}
                    alt={filename}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize opacity-90">
                      {folderBadge}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-2.5 space-y-2">
                  <p className="text-xs font-mono truncate text-muted-foreground" title={filename}>
                    {filename}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {image.width}×{image.height} · {image.format.toUpperCase()}
                  </p>

                  {/* URL row */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={() => handleCopy(image.secure_url)}
                      title={image.secure_url}
                    >
                      {isCopied ? (
                        <><Check className="h-3 w-3 shrink-0 text-green-500" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 shrink-0" /> Copy URL</>
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 shrink-0"
                      onClick={() => window.open(image.secure_url, '_blank')}
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(image.public_id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
