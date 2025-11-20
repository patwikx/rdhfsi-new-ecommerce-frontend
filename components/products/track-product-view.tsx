'use client'

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';

interface TrackProductViewProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
}

export function TrackProductView({ product }: TrackProductViewProps) {
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    // Add to recently viewed when component mounts
    addProduct({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    // Only run once when product ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null; // This component doesn't render anything
}
