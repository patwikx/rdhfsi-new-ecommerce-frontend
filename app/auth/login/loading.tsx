import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <div className="bg-background flex items-start justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Remember Me */}
          <Skeleton className="h-4 w-40" />

          {/* Submit Button */}
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Social Login */}
        <Skeleton className="h-10 w-full" />

        {/* Sign Up Link */}
        <Skeleton className="h-4 w-56 mx-auto mt-6" />
      </div>
    </div>
  );
}
