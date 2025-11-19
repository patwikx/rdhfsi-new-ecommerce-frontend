import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function BrandNotFound() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center py-20">
          <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Brand Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The brand you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/brands">
              <Button variant="outline">View All Brands</Button>
            </Link>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
