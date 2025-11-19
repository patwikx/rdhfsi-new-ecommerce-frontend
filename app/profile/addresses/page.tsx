import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserAddresses } from '@/lib/actions/address-actions';
import { AddressesContent } from '@/components/profile/addresses-content';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Addresses | RD Hardware',
  description: 'Manage your saved addresses',
};

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirect=/profile/addresses');
  }

  const result = await getUserAddresses();

  if (!result.success) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load addresses'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">My Addresses</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your saved shipping and billing addresses
          </p>
        </div>

        {/* Addresses Content */}
        <AddressesContent addresses={result.addresses || []} />
      </div>
    </div>
  );
}
