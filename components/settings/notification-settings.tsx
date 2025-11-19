'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const [isPending, startTransition] = useTransition();
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    productUpdates: true,
    priceAlerts: false,
  });

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    setPreferences({ ...preferences, [key]: value });
    
    startTransition(async () => {
      try {
        // TODO: Implement server action to save notification preferences
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
        toast.success('Preference updated');
      } catch (error) {
        console.error('Error saving preference:', error);
        toast.error('Failed to update preference');
        // Revert on error
        setPreferences({ ...preferences, [key]: !value });
      }
    });
  };

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notification Preferences
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose what notifications you want to receive
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between py-3 border-b border-border">
          <div className="flex-1">
            <p className="font-medium text-sm">Order Updates</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get notified about your order status and delivery updates
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) => handleToggle('orderUpdates', checked)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-start justify-between py-3 border-b border-border">
          <div className="flex-1">
            <p className="font-medium text-sm">Promotions & Offers</p>
            <p className="text-xs text-muted-foreground mt-1">
              Receive special offers, discounts, and promotional emails
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={preferences.promotions}
              onCheckedChange={(checked) => handleToggle('promotions', checked)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-start justify-between py-3 border-b border-border">
          <div className="flex-1">
            <p className="font-medium text-sm">Newsletter</p>
            <p className="text-xs text-muted-foreground mt-1">
              Monthly newsletter with industry news and product highlights
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={preferences.newsletter}
              onCheckedChange={(checked) => handleToggle('newsletter', checked)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-start justify-between py-3 border-b border-border">
          <div className="flex-1">
            <p className="font-medium text-sm">Product Updates</p>
            <p className="text-xs text-muted-foreground mt-1">
              New arrivals and restocked items in your favorite categories
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={preferences.productUpdates}
              onCheckedChange={(checked) => handleToggle('productUpdates', checked)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-start justify-between py-3">
          <div className="flex-1">
            <p className="font-medium text-sm">Price Alerts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get notified when items in your wishlist go on sale
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={preferences.priceAlerts}
              onCheckedChange={(checked) => handleToggle('priceAlerts', checked)}
              disabled={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
