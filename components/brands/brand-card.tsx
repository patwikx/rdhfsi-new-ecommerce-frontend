import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface BrandCardProps {
  brand: {
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    productCount: number;
  };
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="group block bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all"
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-center h-24 mb-4 bg-muted/30 rounded-lg overflow-hidden">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={120}
            height={80}
            className="object-contain max-h-20 group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-4xl font-bold text-muted-foreground/30">
            {brand.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Brand Name */}
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
        {brand.name}
      </h3>

      {/* Description */}
      {brand.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {brand.description}
        </p>
      )}

      {/* Product Count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Package className="w-3.5 h-3.5" />
        <span>
          {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
        </span>
      </div>
    </Link>
  );
}
