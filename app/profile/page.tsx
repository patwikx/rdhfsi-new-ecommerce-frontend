import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProfilePictureUploadWrapper } from '@/components/profile/profile-picture-upload-wrapper';
import { EditableProfileInfo } from '@/components/profile/editable-profile-info';
import { prisma } from '@/lib/prisma';
import { generatePresignedUrl } from '@/lib/minio';
import { toast } from 'sonner';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login?redirect=/profile');
  }

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      alternativePhone: true,
      streetAddress: true,
      city: true,
      province: true,
      postalCode: true,
      companyName: true,
      taxId: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect('/auth/login?redirect=/profile');
  }

  // Get pre-signed URL for profile picture if it exists
  let profileImageUrl: string | null = null;
  if (user.image) {
    try {
      let imageKey = user.image;
      
      // If the stored value is a full URL (legacy data), extract just the filename
      if (imageKey.includes('://')) {
        const url = new URL(imageKey);
        const pathParts = url.pathname.split('/');
        // Get the filename (last part after /pms-bucket/)
        imageKey = pathParts[pathParts.length - 1];
        // Remove query parameters if any
        imageKey = imageKey.split('?')[0];
      }
      
      profileImageUrl = await generatePresignedUrl(imageKey);
      console.log('Generated pre-signed URL:', profileImageUrl);
    } catch (error) {
      toast.error('Error getting pre-signed URL');
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6">
              <div className="flex flex-col items-center text-center">
                <ProfilePictureUploadWrapper 
                  currentImageUrl={profileImageUrl}
                  userName={user.name || 'User'}
                  userId={user.id}
                />
                <h2 className="text-xl font-bold mb-1 mt-4">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

              </div>
            </div>

            {/* Quick Links */}
            <div className="border border-border rounded-lg p-6 mt-6">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/orders" className="block p-2 rounded hover:bg-muted transition-colors">
                  <p className="font-medium text-sm">My Orders</p>
                  <p className="text-xs text-muted-foreground">View order history</p>
                </Link>
                <Link href="/profile/settings" className="block p-2 rounded hover:bg-muted transition-colors">
                  <p className="font-medium text-sm">Settings</p>
                  <p className="text-xs text-muted-foreground">Account preferences & security</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2">
            <EditableProfileInfo 
              initialData={{
                name: user.name || '',
                email: user.email,
                phone: user.phone || undefined,
                alternativePhone: user.alternativePhone || undefined,
                streetAddress: user.streetAddress || undefined,
                city: user.city || undefined,
                province: user.province || undefined,
                postalCode: user.postalCode || undefined,
                companyName: user.companyName || undefined,
                taxId: user.taxId || undefined,
                createdAt: user.createdAt,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
