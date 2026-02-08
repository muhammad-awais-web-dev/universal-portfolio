"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, publicId: string) => void;
  folder?: string;
}

export function ImageLibraryModal({ isOpen, onClose, onSelect, folder = 'portfolio' }: ImageLibraryModalProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, folder]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = images.filter(img => 
        img.public_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchQuery, images]);

  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/cloudinary/list?folder=${encodeURIComponent(folder)}&max_results=100`);
      if (!response.ok) {
        throw new Error('Failed to load images');
      }
      const data = await response.json();
      setImages(data.resources);
      setFilteredImages(data.resources);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images from library');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = () => {
    if (selectedImage) {
      const image = filteredImages.find(img => img.secure_url === selectedImage);
      if (image) {
        onSelect(image.secure_url, image.public_id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Image Library</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                {searchQuery ? 'No images found matching your search' : 'No images in library'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <button
                  key={image.public_id}
                  onClick={() => setSelectedImage(image.secure_url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedImage === image.secure_url
                      ? 'border-primary shadow-lg'
                      : 'border-transparent hover:border-muted'
                  }`}
                >
                  <img
                    src={image.secure_url}
                    alt={image.public_id}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === image.secure_url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelectImage} disabled={!selectedImage}>
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
