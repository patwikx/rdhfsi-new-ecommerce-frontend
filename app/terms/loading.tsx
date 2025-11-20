import { Skeleton } from '@/components/ui/skeleton';

export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-80 mb-6" />
        {/* Last updated */}
        <Skeleton className="h-4 w-48 mb-8" />

        {/* Sections */}
        {Array.from({ length: 8 }).map((_, i) => (
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
