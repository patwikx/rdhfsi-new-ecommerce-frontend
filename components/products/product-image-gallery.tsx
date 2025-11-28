'use client'

import { useState } from 'react';
import { Package } from 'lucide-react';
import { MinioImage } from '@/components/shared/minio-image';

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);

  if (!selectedImage && images.length === 0) {
    return (
      <div>
        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border">
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-32 h-32 text-muted-foreground/40" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={`placeholder-${i}`} className="aspect-square bg-muted rounded-sm border border-border flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border">
        <MinioImage
          src={selectedImage?.url}
          alt={selectedImage?.altText || productName}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square bg-muted rounded-sm overflow-hidden cursor-pointer transition-all border-2 ${
              selectedImage?.id === image.id
                ? 'border-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <MinioImage
              src={image.url}
              alt={image.altText || productName}
              fill
              className="object-cover"
            />
          </button>
        ))}
        
        {/* Show placeholder boxes if less than 4 images */}
        {images.length < 4 && [...Array(4 - images.length)].map((_, i) => (
          <div key={`placeholder-${i}`} className="aspect-square bg-muted rounded-sm border border-border flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
