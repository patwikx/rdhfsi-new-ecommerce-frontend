import { Skeleton } from '@/components/ui/skeleton';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-48 mb-6" />
        
        {/* Intro paragraph */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-8" />

        {/* Section 1 */}
        <div className="mt-8">
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Section 2 */}
        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Section 3 */}
        <div className="mt-8">
          <Skeleton className="h-8 w-56 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>

        {/* Section 4 */}
        <div className="mt-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </div>
  );
}
