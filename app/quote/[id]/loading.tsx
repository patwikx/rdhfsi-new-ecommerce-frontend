import { Skeleton } from '@/components/ui/skeleton';

export default function QuoteDetailLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          {/* Left Column - Quote Information */}
          <div className="border border-border rounded-lg p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <Skeleton className="h-6 w-56 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="pt-6 border-t border-border">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>

            {/* Quote Summary */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="pt-6 border-t border-border">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Quote Items */}
          <div className="border border-border rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
