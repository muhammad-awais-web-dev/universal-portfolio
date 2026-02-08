"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  currentUrl?: string;
}

export function ImageUrlModal({ isOpen, onClose, onSubmit, currentUrl }: ImageUrlModalProps) {
  const [url, setUrl] = useState(currentUrl || '');
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    onSubmit(url);
    onClose();
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError(null);
  };

  const handleBlur = () => {
    if (url.trim()) {
      setPreview(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Image from URL</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="https://example.com/image.jpg"
              className="mt-2"
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <Label>Preview</Label>
              <div className="mt-2 border rounded-lg overflow-hidden bg-muted/30">
                <img
                  src={preview}
                  alt="URL preview"
                  className="w-full h-auto max-h-96 object-contain"
                  onError={() => {
                    setPreview(null);
                    setError('Failed to load image from URL');
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Image
          </Button>
        </div>
      </div>
    </div>
  );
}
