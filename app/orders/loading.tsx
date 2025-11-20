import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
