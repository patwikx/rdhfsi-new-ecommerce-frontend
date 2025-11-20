import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Truck, Award, Clock } from 'lucide-react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Carousel Skeleton */}
      <section className="px-6 pt-6">
        <div className="max-w-[1600px] mx-auto">
          <Skeleton className="w-full aspect-[21/9] rounded-lg" />
        </div>
      </section>

      {/* Browse Categories Skeleton */}
      <section className="py-6 px-6 bg-zinc-900 mt-6">
        <div className="max-w-[1600px] mx-auto">
          <Skeleton className="h-7 w-48 mb-4 bg-zinc-800" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-black border border-zinc-800 rounded px-4 py-3 min-w-[140px]"
              >
                <Skeleton className="h-5 w-24 mb-2 bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16 bg-zinc-800" />
                  <Skeleton className="h-4 w-10 bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section Skeleton */}
      <section className="py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card">
                {/* Image */}
                <Skeleton className="aspect-square w-full mb-3 rounded" />
                {/* Title */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                {/* SKU */}
                <Skeleton className="h-3 w-20 mb-2" />
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                {/* Price */}
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-6 border-y border-border bg-muted/30">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Secure Ordering</p>
                <p className="text-xs text-muted-foreground">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Same Day Available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Certified Products</p>
                <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Always Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
