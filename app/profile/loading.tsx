import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar Skeleton */}
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
                {/* Name Skeleton */}
                <Skeleton className="h-7 w-40 mb-2" />
                {/* Email Skeleton */}
                <Skeleton className="h-5 w-48" />
              </div>
            </div>

            {/* Quick Links Skeleton */}
            <div className="border border-border rounded-lg p-6 mt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-2 rounded">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Information Skeleton */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-9 w-20" />
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Information Section */}
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed Skeleton */}
        <div className="mt-8 py-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card">
                <Skeleton className="aspect-square w-full mb-3 rounded" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
