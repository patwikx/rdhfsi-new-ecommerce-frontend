import { prisma } from '@/lib/prisma';
import { generatePresignedUrl } from '@/lib/minio';
import UserNav from './user-nav';

interface UserNavWrapperProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    companyName?: string | null;
  } | null;
}

export default async function UserNavWrapper({ user }: UserNavWrapperProps) {
  if (!user?.email) {
    return <UserNav user={user} />;
  }

  // Fetch fresh user data from database to get the image
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { image: true },
  });

  let profileImageUrl: string | null = null;
  
  if (dbUser?.image) {
    try {
      let imageKey = dbUser.image;
      
      // If the stored value is a full URL (legacy data), extract just the filename
      if (imageKey.includes('://')) {
        const url = new URL(imageKey);
        const pathParts = url.pathname.split('/');
        imageKey = pathParts[pathParts.length - 1];
        imageKey = imageKey.split('?')[0];
      }
      
      profileImageUrl = await generatePresignedUrl(imageKey);
    } catch (error) {
      console.error('Error getting pre-signed URL for nav:', error);
    }
  }

  return <UserNav user={{ ...user, image: profileImageUrl }} />;
}
