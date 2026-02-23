import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-96 mb-4" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Sort and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="w-full aspect-square mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
