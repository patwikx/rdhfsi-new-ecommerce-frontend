import { Skeleton } from '@/components/ui/skeleton';

export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-96 mb-6" />
        {/* Description */}
        <Skeleton className="h-6 w-full max-w-2xl mb-12" />

        {/* FAQ Items */}
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border rounded-lg px-6 py-4">
              <Skeleton className="h-6 w-full max-w-md" />
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-5 w-full max-w-lg mb-4" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );
}
