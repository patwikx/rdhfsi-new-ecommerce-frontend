import { Skeleton } from '@/components/ui/skeleton';

export default function BulkOrderLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Tabs */}
        <Skeleton className="h-10 w-80 mb-8" />

        {/* Items Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>

          {/* Item Rows */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-muted/30 rounded-lg border border-border">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-3">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-1">
                  <Skeleton className="h-10 w-10 mt-6" />
                </div>
              </div>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-6 pt-8">
            <Skeleton className="h-7 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="col-span-full space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
