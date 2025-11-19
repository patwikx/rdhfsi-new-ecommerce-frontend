import { Metadata } from 'next';
import { BulkOrderForm } from '@/components/bulk-order/bulk-order-form';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bulk Order | RD Hardware',
  description: 'Place bulk orders or request quotes for large quantities',
};

export default function BulkOrderPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Bulk Order</h1>
          </div>
          <p className="text-muted-foreground">
            Place bulk orders or request quotes for large quantities
          </p>
        </div>

        {/* Bulk Order Form */}
        <BulkOrderForm />
      </div>
    </div>
  );
}
