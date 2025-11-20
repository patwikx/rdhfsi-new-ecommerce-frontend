import { Skeleton } from '@/components/ui/skeleton';

export default function SaleLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Carousel */}
        <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-lg mb-8" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>

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
