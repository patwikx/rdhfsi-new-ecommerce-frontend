'use client'

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import Link from 'next/link';
import { X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RecentlyViewed() {
  const { recentlyViewed, clearAll } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all bg-card"
          >
            <div className="aspect-square relative mb-3 bg-muted rounded overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-lg font-bold">
              ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
