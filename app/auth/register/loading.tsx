import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterLoading() {
  return (
    <div className="bg-background flex items-center justify-center px-4 py-12 min-h-screen">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Register Form */}
        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Terms and Conditions */}
          <Skeleton className="h-4 w-full max-w-md" />

          {/* Submit Button */}
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Social Login */}
        <Skeleton className="h-10 w-full" />

        {/* Sign In Link */}
        <Skeleton className="h-4 w-48 mx-auto mt-6" />
      </div>
    </div>
  );
}
