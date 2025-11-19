import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - 5 columns */}
          <div className="lg:col-span-5">
            <div>
              {/* Main Image */}
              <Skeleton className="aspect-square w-full rounded-lg mb-4" />
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header */}
            <div>
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Price and Delivery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Card */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-border">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-10 w-32" />
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>

              {/* Delivery Card */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-border">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-muted/50 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
