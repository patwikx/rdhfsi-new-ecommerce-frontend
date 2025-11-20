import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 bg-card space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-24 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card">
                  <Skeleton className="aspect-square w-full mb-3 rounded" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
