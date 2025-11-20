import { Skeleton } from '@/components/ui/skeleton';

export default function ShippingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-72 mb-6" />
        {/* Description */}
        <Skeleton className="h-6 w-full max-w-2xl mb-12" />

        {/* Shipping Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <Skeleton className="w-8 h-8 mb-4" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>

        {/* Sections */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
