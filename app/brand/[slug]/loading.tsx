import { Skeleton } from '@/components/ui/skeleton';

export default function BrandLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Skeleton className="h-4 w-12" />
            <span>/</span>
            <Skeleton className="h-4 w-16" />
            <span>/</span>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Brand Logo */}
            <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />

            {/* Brand Info */}
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-full max-w-2xl mb-4" />
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
            <Skeleton className="h-7 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-48" />
            </div>
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
          <div className="flex items-center justify-center gap-2 pt-6">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-10" />
            <Skeleton className="h-9 w-10" />
            <Skeleton className="h-9 w-10" />
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Page Info */}
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
