'use client'

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from './product-card';
import { Package } from 'lucide-react';
import type { ProductWithDetails } from '@/app/actions/products';
import { getProducts } from '@/app/actions/products';

interface ProductsListProps {
  initialProducts: ProductWithDetails[];
  totalProducts: number;
}

export default function ProductsList({ initialProducts, totalProducts }: ProductsListProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(initialProducts.length < totalProducts);

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const newProducts = await getProducts({ 
        limit: 8,
        offset: nextPage * 8 - 8
      });
      
      setProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(products.length + newProducts.length < totalProducts);
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
        <p className="text-muted-foreground mb-4">
          Sync your inventory from the legacy system to see products here.
        </p>
        <Button asChild>
          <a href="/admin/inventory-sync">Go to Sync Page</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Showing all {products.length} products
        </div>
      )}
    </>
  );
}
