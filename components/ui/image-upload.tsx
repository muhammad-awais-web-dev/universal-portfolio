"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Link2, FolderOpen, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUrlModal } from './image-url-modal';
import { ImageLibraryModal } from './image-library-modal';
import { useCloudinaryStatus } from '@/hooks/use-cloudinary-status';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string, publicId: string) => void;
  onDelete?: () => void;
  folder?: string; // Cloudinary folder path
  publicIdPrefix?: string; // Custom filename prefix (e.g., "project_myslug", "avatar_johnsmith")
  aspectRatio?: string; // e.g., "16:9", "1:1", "4:3"
  maxSize?: number; // Max file size in MB
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onDelete,
  folder = 'portfolio',
  publicIdPrefix,
  aspectRatio,
  maxSize = 10,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudinaryStatus = useCloudinaryStatus();
  const cloudinaryReady = cloudinaryStatus === 'connected';

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = publicIdPrefix ? `${publicIdPrefix}_${timestamp}` : undefined;

      // Build params to sign
      const paramsToSign: Record<string, string | number> = { timestamp, folder };
      if (publicId) paramsToSign.public_id = publicId;

      // Get signature from server (also validates Cloudinary is connected)
      const signRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!signRes.ok) {
        const err = await signRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || 'Cloudinary is not connected');
      }

      const { signature, cloud_name, api_key } = await signRes.json() as {
        signature: string;
        cloud_name: string;
        api_key: string;
      };

      // Signed upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);
      if (publicId) formData.append('public_id', publicId);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!uploadRes.ok) throw new Error('Upload failed');

      const data = await uploadRes.json() as { secure_url: string; public_id: string };
      setPreview(data.secure_url);
      onChange(data.secure_url, data.public_id);
      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    setPreview(undefined);
    if (onDelete) {
      onDelete();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = (url: string) => {
    setPreview(url);
    onChange(url, '');
    setError(null);
  };

  const handleLibrarySelect = (url: string, publicId: string) => {
    setPreview(url);
    onChange(url, publicId);
    setError(null);
  };

  const isSquare = aspectRatio === '1:1';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview */}
      <div className={`relative bg-muted rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${isSquare ? 'w-64 h-64 mx-auto' : 'w-full h-64'}`}>
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="w-full h-full object-contain"
              unoptimized
            />
            {/* Delete button overlay */}
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-12 w-12 mb-2" />
            <p className="text-sm">No image selected</p>
            {aspectRatio && (
              <p className="text-xs mt-1">Suggested aspect ratio: {aspectRatio}</p>
            )}
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
            <p className="text-sm text-white">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <TooltipProvider>
        <div className="grid grid-cols-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={isUploading || !cloudinaryReady}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </span>
            </TooltipTrigger>
            {!cloudinaryReady && (
              <TooltipContent>Connect Cloudinary in Integrations to upload images</TooltipContent>
            )}
          </Tooltip>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUrlModal(true)}
            disabled={isUploading}
            className="w-full"
          >
            <Link2 className="h-4 w-4 mr-2" />
            From URL
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLibraryModal(true)}
                  disabled={isUploading || !cloudinaryReady}
                  className="w-full"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  From Library
                </Button>
              </span>
            </TooltipTrigger>
            {!cloudinaryReady && (
              <TooltipContent>Connect Cloudinary in Integrations to browse library</TooltipContent>
            )}
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Info text */}
      <p className="text-xs text-muted-foreground">
        Max file size: {maxSize}MB
      </p>

      {/* Upload Progress Bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Modals */}
      <ImageUrlModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onSubmit={handleUrlSubmit}
        currentUrl={preview}
      />
      
      <ImageLibraryModal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        onSelect={handleLibrarySelect}
        folder={folder}
      />
    </div>
  );
}
