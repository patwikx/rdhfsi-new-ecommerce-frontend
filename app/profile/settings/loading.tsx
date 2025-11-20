import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="space-y-6">
          {/* Saved Addresses Section */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-56 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-40 mt-4" />
          </div>

          {/* Security Settings Section */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-64 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
