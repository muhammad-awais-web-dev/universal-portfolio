"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2, Search, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadImages();
      setSelectedForDelete(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const toggleSelectForDelete = (publicId: string) => {
    const newSelected = new Set(selectedForDelete);
    if (newSelected.has(publicId)) {
      newSelected.delete(publicId);
    } else {
      newSelected.add(publicId);
    }
    setSelectedForDelete(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedForDelete.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedForDelete.size} image(s)? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds: Array.from(selectedForDelete) }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete images');
      }

      // Reload images after deletion
      setSelectedForDelete(new Set());
      await loadImages();
    } catch (err) {
      console.error('Error deleting images:', err);
      setError('Failed to delete images');
    } finally {
      setIsDeleting(false);
    }
  };

  const startRename = (publicId: string) => {
    const filename = publicId.split('/').pop() || '';
    setRenamingId(publicId);
    setNewName(filename);
  };

  const handleRename = async (oldPublicId: string) => {
    if (!newName.trim() || newName === oldPublicId.split('/').pop()) {
      setRenamingId(null);
      return;
    }

    setError(null);

    try {
      // Construct new public_id with same folder path
      const parts = oldPublicId.split('/');
      parts[parts.length - 1] = newName;
      const newPublicId = parts.join('/');

      const response = await fetch('/api/cloudinary/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPublicId, newPublicId }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename image');
      }

      // Reload images after rename
      setRenamingId(null);
      await loadImages();
    } catch (err) {
      console.error('Error renaming image:', err);
      setError('Failed to rename image');
    }
  };

  const getImageName = (publicId: string) => {
    return publicId.split('/').pop() || publicId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Image Library</h2>
            {selectedForDelete.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="h-4 w-4 mr-2" /> Delete ({selectedForDelete.size})</>
                )}
              </Button>
            )}
          </div>
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
                <div
                  key={image.public_id}
                  className="relative group"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedForDelete.has(image.public_id)}
                      onCheckedChange={() => toggleSelectForDelete(image.public_id)}
                      className="bg-white"
                    />
                  </div>

                  {/* Image */}
                  <button
                    onClick={() => setSelectedImage(image.secure_url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full ${
                      selectedImage === image.secure_url
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <img
                      src={image.secure_url}
                      alt={getImageName(image.public_id)}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === image.secure_url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Image Name and Actions */}
                  <div className="mt-2 space-y-1">
                    {renamingId === image.public_id ? (
                      <div className="flex gap-1">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(image.public_id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="h-7 text-xs"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleRename(image.public_id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => setRenamingId(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs truncate flex-1" title={getImageName(image.public_id)}>
                          {getImageName(image.public_id)}
                        </p>
                        <button
                          onClick={() => startRename(image.public_id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
