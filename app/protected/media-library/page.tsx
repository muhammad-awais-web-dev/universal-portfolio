'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Copy, 
  Search,
  ChevronRight,
  Home,
  Loader2
} from 'lucide-react';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}


const FOLDERS = [
  { name: 'bio', label: 'Bio / Profile', icon: '👤' },
  { name: 'projects', label: 'Projects', icon: '📁' },
  { name: 'certifications', label: 'Certifications', icon: '🏆' },
  { name: 'testimonials', label: 'Testimonials', icon: '💬' },
  { name: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function MediaLibraryPage() {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFolderImages = async (folder: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cloudinary/list?folder=${folder}&max_results=100`);
      if (!response.ok) throw new Error('Failed to load images');
      
      const data = await response.json();
      setImages(data.resources || []);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
    loadFolderImages(folder);
    setSearchTerm('');
  };

  const handleBackToRoot = () => {
    setCurrentFolder(null);
    setImages([]);
    setSearchTerm('');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard');
  };

  const handleDownload = (url: string, publicId: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = publicId.split('/').pop() || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (!response.ok) throw new Error('Failed to delete image');
      
      alert('Image deleted successfully');
      // Reload images
      if (currentFolder) {
        loadFolderImages(currentFolder);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const filteredImages = images.filter(img => 
    img.public_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage all uploaded images organized by folder
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToRoot}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Library
        </Button>
        {currentFolder && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="secondary">
              {FOLDERS.find(f => f.name === currentFolder)?.label || currentFolder}
            </Badge>
          </>
        )}
      </div>

      {/* Folder View */}
      {!currentFolder && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FOLDERS.map((folder) => (
            <Card
              key={folder.name}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleFolderClick(folder.name)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{folder.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{folder.label}</CardTitle>
                    <CardDescription>View images</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Images View */}
      {currentFolder && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Badge variant="outline">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </Badge>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredImages.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No images match your search' : 'No images in this folder'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Images Grid */}
          {!loading && filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card key={image.public_id} className="overflow-hidden">
                  {/* Image Preview */}
                  <div className="aspect-square bg-muted relative group">
                    <img
                      src={image.secure_url}
                      alt={image.public_id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleCopyUrl(image.secure_url)}
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownload(image.secure_url, image.public_id)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(image.public_id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <CardContent className="p-3">
                    <p className="text-xs font-mono truncate" title={image.public_id}>
                      {image.public_id.split('/').pop()}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{image.width} × {image.height}</span>
                      <span className="uppercase">{image.format}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
