import { Skeleton } from '@/components/ui/skeleton';

export default function ForgotPasswordLoading() {
  return (
    <div className="bg-background flex items-start justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-56 mx-auto mb-2" />
          <Skeleton className="h-5 w-full max-w-sm mx-auto mb-1" />
          <Skeleton className="h-5 w-full max-w-xs mx-auto" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Back to Login Link */}
        <Skeleton className="h-4 w-40 mx-auto mt-6" />
      </div>
    </div>
  );
}
