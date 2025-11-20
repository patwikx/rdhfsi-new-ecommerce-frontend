import { Skeleton } from '@/components/ui/skeleton';

export default function AddressesLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Add Address Button */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
