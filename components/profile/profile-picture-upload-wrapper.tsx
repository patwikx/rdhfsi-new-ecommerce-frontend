'use client';

import { ProfilePictureUpload } from './profile-picture-upload';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProfilePictureUploadWrapperProps {
  currentImageUrl?: string | null;
  userName: string;
  userId: string;
}

export function ProfilePictureUploadWrapper({ 
  currentImageUrl, 
  userName,
  userId
}: ProfilePictureUploadWrapperProps) {
  const router = useRouter();

  const handleUploadComplete = async (imageUrl: string) => {
    try {
      // Update user profile with new image URL (stores the MinIO key, not the pre-signed URL)
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      toast.success('Profile picture updated successfully!');
      
      // Refresh the page to fetch new pre-signed URL
      router.refresh();
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  return (
    <ProfilePictureUpload
      currentImageUrl={currentImageUrl}
      userName={userName}
      onUploadComplete={handleUploadComplete}
    />
  );
}
