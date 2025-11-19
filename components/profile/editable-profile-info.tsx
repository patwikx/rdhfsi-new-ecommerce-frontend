'use client';

import { useState } from 'react';
import { Mail, Phone, Building2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  alternativePhone?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  companyName?: string;
  taxId?: string;
  createdAt: Date;
}

interface EditableProfileInfoProps {
  initialData: ProfileData;
}

export function EditableProfileInfo({ initialData }: EditableProfileInfoProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Account Information</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              ) : (
                <p className="font-medium">{formData.name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email Address
              </p>
              <p className="font-medium text-sm">{formData.email}</p>
              {isEditing && (
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
              {isEditing ? (
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="font-medium text-sm">{formData.phone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alternative Phone</p>
              {isEditing ? (
                <Input
                  value={formData.alternativePhone || ''}
                  onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                  placeholder="Enter alternative phone"
                />
              ) : (
                <p className="font-medium text-sm">{formData.alternativePhone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Address Information
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Street Address</p>
              {isEditing ? (
                <Input
                  value={formData.streetAddress || ''}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Enter street address"
                />
              ) : (
                <p className="font-medium text-sm">{formData.streetAddress || 'Not provided'}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">City</p>
                {isEditing ? (
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                ) : (
                  <p className="font-medium text-sm">{formData.city || 'Not provided'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Province</p>
                {isEditing ? (
                  <Input
                    value={formData.province || ''}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Enter province"
                  />
                ) : (
                  <p className="font-medium text-sm">{formData.province || 'Not provided'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Postal Code</p>
                {isEditing ? (
                  <Input
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Enter postal code"
                  />
                ) : (
                  <p className="font-medium text-sm">{formData.postalCode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Company Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Company Name</p>
              {isEditing ? (
                <Input
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              ) : (
                <p className="font-medium text-sm">{formData.companyName || 'Not provided'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tax ID / TIN</p>
              {isEditing ? (
                <Input
                  value={formData.taxId || ''}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Enter tax ID"
                />
              ) : (
                <p className="font-medium text-sm">{formData.taxId || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Account Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Member Since</p>
              <p className="font-medium text-sm">
                {new Date(formData.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing ? (
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}
