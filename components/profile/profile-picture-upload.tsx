/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { User, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  userName: string;
  onUploadComplete: (imageUrl: string) => void;
}

export function ProfilePictureUpload({ 
  currentImageUrl, 
  userName,
  onUploadComplete 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (result.success && result.fileName) {
        toast.success('Profile picture uploaded successfully!');
        // Pass the fileName (MinIO key) - should be just the filename like "1763568977274-c1mw5hiis2c.jpg"
        onUploadComplete(result.fileName);
      } else {
        throw new Error('Upload failed: Invalid server response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  console.log('Current preview URL:', previewUrl); // Debug log

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-32 h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center border-2 border-border">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        
        {/* Upload overlay */}
        {!isUploading ? (
          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rounded-md">
            <div className="text-white text-center">
              <Upload className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs">Change Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        ) : (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-md">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <span className="text-white text-xs font-medium">{uploadProgress}%</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click to upload<br />Max 5MB
      </p>
    </div>
  );
}
