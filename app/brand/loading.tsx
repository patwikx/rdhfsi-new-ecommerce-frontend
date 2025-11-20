import { Skeleton } from '@/components/ui/skeleton';

export default function BrandsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Carousel */}
        <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-lg mb-8" />

        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Featured Brands Section */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-6 bg-card">
                <Skeleton className="w-full aspect-square mb-4 rounded" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* All Brands Section */}
        <div>
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-6 bg-card">
                <Skeleton className="w-full aspect-square mb-4 rounded" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
