import { Skeleton } from '@/components/ui/skeleton';

export default function QuotesLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Quotes List */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-5 w-28" />
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
