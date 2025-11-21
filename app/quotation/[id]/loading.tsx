import { Skeleton } from '@/components/ui/skeleton';

export default function QuotationDocumentLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Action Bar */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b">
            <div>
              <Skeleton className="h-9 w-96 mb-2" />
              <Skeleton className="h-4 w-64 mb-1" />
              <Skeleton className="h-4 w-72 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="text-right">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="border rounded">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
