'use client';

import Image from 'next/image';
import { useState } from 'react';

interface MinioImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function MinioImage({ src, alt, fill, className, sizes, priority }: MinioImageProps) {
  const [error, setError] = useState(false);

  // For presigned URLs, we need to use unoptimized mode
  const isPresignedUrl = src.includes('X-Amz-Algorithm') || src.includes('X-Amz-Credential');

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <svg className="w-16 h-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isPresignedUrl}
      onError={() => setError(true)}
    />
  );
}
