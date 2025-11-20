import { Skeleton } from '@/components/ui/skeleton';

export default function ReturnsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-64 mb-6" />
        {/* Description */}
        <Skeleton className="h-6 w-full max-w-2xl mb-12" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg text-center">
              <Skeleton className="w-8 h-8 mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          ))}
        </div>

        {/* Sections */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton className="h-8 w-72 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3 mb-4" />
            {/* List items */}
            <div className="space-y-2 pl-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
