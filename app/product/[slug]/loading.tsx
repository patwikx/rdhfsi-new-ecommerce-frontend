import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images Skeleton - 5 columns */}
          <div className="lg:col-span-5">
            <Skeleton className="aspect-square w-full rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-sm" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header */}
            <div>
              <Skeleton className="h-10 w-3/4 mb-3" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Price and Delivery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Section */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-border">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-9 w-40" />
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                <Skeleton className="h-6 w-48 mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-40 mb-1" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Skeleton */}
            <div className="bg-muted/50 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="py-8 border-t border-border">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card">
                <Skeleton className="aspect-square w-full mb-3 rounded" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
