import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <Skeleton className="h-9 w-32 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - 1 column */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 bg-card sticky top-24">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between border-t pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
              <Skeleton className="h-12 w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
