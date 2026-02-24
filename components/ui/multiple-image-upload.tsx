'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { ImageUrlModal } from './image-url-modal';
import { ImageLibraryModal } from './image-library-modal';
import { X, Upload, Link2, FolderOpen, GripVertical } from 'lucide-react';

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  publicIdPrefix?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  images,
  onChange,
  folder = 'portfolio',
  publicIdPrefix = 'image',
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        // Generate signature
        const timestamp = Math.round(new Date().getTime() / 1000);
        const currentPublicId = `${publicIdPrefix}_${Date.now()}_${index}`;

        const signatureResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder,
            public_id: currentPublicId,
            timestamp,
          }),
        });

        if (!signatureResponse.ok) {
          throw new Error('Failed to get upload signature');
        }

        const { signature } = await signatureResponse.json();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('public_id', currentPublicId);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await uploadResponse.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlAdd = (url: string) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange([...images, url]);
    setShowUrlModal(false);
  };

  const handleLibrarySelect = (url: string) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange([...images, url]);
    setShowLibraryModal(false);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move group ${
                draggedIndex === index ? 'border-primary opacity-50' : 'border-border'
              }`}
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10 bg-background/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Image */}
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                fill
                className="w-full h-full object-cover"
                unoptimized
              />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Index Badge */}
              <div className="absolute bottom-2 left-2 bg-background/80 text-foreground text-xs font-medium px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {images.length < maxImages && (
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUrlModal(true)}
          >
            <Link2 className="h-4 w-4 mr-2" />
            From URL
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowLibraryModal(true)}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            From Library
          </Button>
        </div>
      )}

      {/* Info Text */}
      <p className="text-sm text-muted-foreground">
        {images.length} of {maxImages} images • Drag to reorder
      </p>

      {/* Modals */}
      {showUrlModal && (
        <ImageUrlModal
          isOpen={showUrlModal}
          onClose={() => setShowUrlModal(false)}
          onSubmit={handleUrlAdd}
        />
      )}

      {showLibraryModal && (
        <ImageLibraryModal
          isOpen={showLibraryModal}
          onClose={() => setShowLibraryModal(false)}
          onSelect={handleLibrarySelect}
          folder={folder}
        />
      )}
    </div>
  );
}
