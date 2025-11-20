import { Skeleton } from '@/components/ui/skeleton';

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <Skeleton className="h-10 w-56 mb-6" />
        {/* Description */}
        <Skeleton className="h-6 w-full max-w-2xl mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Subject field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>

              {/* Submit button */}
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Skeleton className="h-8 w-72 mb-6" />
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <Skeleton className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Skeleton className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <Skeleton className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-44 mb-1" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <Skeleton className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
