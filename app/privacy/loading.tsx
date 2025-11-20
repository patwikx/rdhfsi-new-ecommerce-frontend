import { Skeleton } from '@/components/ui/skeleton';

export default function PrivacyLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-72 mb-6" />
        {/* Last updated */}
        <Skeleton className="h-4 w-48 mb-8" />

        {/* Sections */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton className="h-8 w-80 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3 mb-4" />
            {/* List items */}
            <div className="space-y-2 pl-6">
              <Skeleton className="h-4 w-full" />
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
