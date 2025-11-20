import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-4 py-6">
        {/* Back Button */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer & Order Information */}
          <div className="border border-border rounded-lg p-6 space-y-6 h-fit">
            {/* Customer Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-56" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Information */}
            <div className="pt-6 border-t border-border grid grid-cols-2 gap-6">
              {/* Delivery */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="pt-6 border-t border-border">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="border border-border rounded-lg p-6 space-y-6 h-fit">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="space-y-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 pb-2.5 border-b">
                    <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-1" />
                      <Skeleton className="h-3 w-24 mb-1.5" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
