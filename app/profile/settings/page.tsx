import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SavedAddressesSettings } from '@/components/settings/saved-addresses-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { getUserAddresses } from '@/app/actions/addresses';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login?redirect=/profile/settings');
  }

  const addresses = await getUserAddresses();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>

        <div className="space-y-6">
          {/* Saved Addresses */}
          <SavedAddressesSettings initialAddresses={addresses} />

          {/* Security Settings */}
          <SecuritySettings />

          {/* Notification Preferences */}
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
