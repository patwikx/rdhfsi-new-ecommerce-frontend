'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MapPin, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createAddress, setDefaultAddress, deleteAddress } from '@/app/actions/addresses';

type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  email: string | null;
  companyName: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  isBilling: boolean;
};

interface SavedAddressesSettingsProps {
  initialAddresses: Address[];
}

export function SavedAddressesSettings({ initialAddresses }: SavedAddressesSettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false,
  });

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      try {
        await setDefaultAddress(addressId);
        toast.success('Default address updated');
      } catch (error: any) {
        console.error('Error setting default:', error);
        toast.error(error.message || 'Failed to update default address');
      }
    });
  };

  const handleDelete = (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    startTransition(async () => {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted');
      } catch (error: any) {
        console.error('Error deleting address:', error);
        toast.error(error.message || 'Failed to delete address');
      }
    });
  };

  const handleSaveNew = () => {
    startTransition(async () => {
      try {
        await createAddress(newAddress);
        toast.success('Address added successfully');
        setIsAdding(false);
        setNewAddress({
          label: '',
          fullName: '',
          phone: '',
          email: '',
          companyName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          province: '',
          postalCode: '',
          isDefault: false,
        });
      } catch (error: any) {
        console.error('Error saving address:', error);
        toast.error(error.message || 'Failed to save address');
      }
    });
  };

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Saved Addresses
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        )}
      </div>

      {/* Add New Address Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="font-semibold mb-4">New Address</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Label (e.g., Home, Office)</p>
                <Input
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="Home"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <Input
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  placeholder="Juan Dela Cruz"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <Input
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="09XX XXX XXXX"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email (Optional)</p>
                <Input
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Company Name (Optional)</p>
              <Input
                value={newAddress.companyName}
                onChange={(e) => setNewAddress({ ...newAddress, companyName: e.target.value })}
                placeholder="Company Name"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Address Line 1</p>
              <Input
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                placeholder="House No., Street Name, Barangay"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Address Line 2 (Optional)</p>
              <Input
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                placeholder="Building, Unit, Floor"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">City</p>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="General Santos"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Province</p>
                <Input
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  placeholder="South Cotabato"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Postal Code</p>
                <Input
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  placeholder="9500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isDefault" className="text-sm">Set as default address</label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSaveNew} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Address'}
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Address List */}
      {initialAddresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No saved addresses yet</p>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {initialAddresses.map((address) => (
            <div
              key={address.id}
              className="border border-border rounded-lg p-4 relative hover:border-primary transition-colors"
            >
              {address.isDefault && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    <Star className="h-3 w-3 fill-current" />
                    Default
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                {address.label && (
                  <p className="font-semibold text-sm">{address.label}</p>
                )}
                <p className="font-medium">{address.fullName}</p>
                {address.companyName && (
                  <p className="text-sm text-muted-foreground">{address.companyName}</p>
                )}
                <p className="text-sm">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </p>
                <p className="text-sm">
                  {address.city}, {address.province} {address.postalCode}
                </p>
                <p className="text-sm">{address.country}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                {address.email && (
                  <p className="text-sm text-muted-foreground">{address.email}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
