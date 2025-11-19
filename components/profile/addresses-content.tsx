'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { AddressDialog } from '@/components/settings/address-dialog';
import { deleteAddress, setDefaultAddress } from '@/lib/actions/address-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Address {
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
}

interface AddressesContentProps {
  addresses: Address[];
}

export function AddressesContent({ addresses: initialAddresses }: AddressesContentProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setDeletingId(id);
    const result = await deleteAddress(id);

    if (result.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address deleted');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete address');
    }
    setDeletingId(null);
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);

    if (result.success) {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      toast.success('Default address updated');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to set default address');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    router.refresh();
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add your first address for faster checkout
        </p>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
        <AddressDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogClose}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-card border rounded-lg p-4 relative ${
              address.isDefault ? 'border-primary' : 'border-border'
            }`}
          >
            {/* Default Badge */}
            {address.isDefault && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <Star className="w-3 h-3" />
                Default
              </div>
            )}

            {/* Label */}
            {address.label && (
              <div className="text-xs font-semibold text-primary mb-2 uppercase">
                {address.label}
              </div>
            )}

            {/* Address Details */}
            <div className="space-y-1 mb-4">
              <p className="font-semibold">{address.fullName}</p>
              {address.companyName && (
                <p className="text-sm text-muted-foreground">{address.companyName}</p>
              )}
              <p className="text-sm">{address.addressLine1}</p>
              {address.addressLine2 && <p className="text-sm">{address.addressLine2}</p>}
              <p className="text-sm">
                {address.city}, {address.province} {address.postalCode}
              </p>
              <p className="text-sm">{address.country}</p>
              <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
              {address.email && (
                <p className="text-sm text-muted-foreground">{address.email}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {address.isBilling && (
                <span className="text-xs bg-muted px-2 py-1 rounded">Billing</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!address.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(address.id)}
                  className="flex-1"
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(address)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(address.id)}
                disabled={deletingId === address.id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Address Dialog */}
      <AddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
        onSuccess={handleDialogClose}
      />
    </div>
  );
}
