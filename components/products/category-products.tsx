'use client'

import { useState, useTransition, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';
import ProductCard from './product-card';
import { Package } from 'lucide-react';
import type { ProductWithDetails } from '@/app/actions/products';
import { getProductsByCategory } from '@/app/actions/products';

interface CategoryProductsProps {
  categorySlug: string;
  initialProducts: ProductWithDetails[];
  totalProducts: number;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest';
type ViewMode = 'grid' | 'list';

export default function CategoryProducts({ 
  categorySlug,
  initialProducts, 
  totalProducts 
}: CategoryProductsProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [sortedProducts, setSortedProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const applySorting = (productsList: ProductWithDetails[], sort: SortOption) => {
    const sorted = [...productsList];

    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.poPrice - b.poPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.poPrice - a.poPrice);
        break;
      case 'newest':
        // Already sorted by createdAt desc from server
        break;
      case 'relevance':
      default:
        // Keep original order
        break;
    }

    return sorted;
  };

  const handleSort = (sort: SortOption) => {
    setSortBy(sort);
    const sorted = applySorting(products, sort);
    setSortedProducts(sorted);
  };

  const loadMore = async () => {
    if (isLoadingMore || products.length >= totalProducts) return;
    
    setIsLoadingMore(true);
    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const newProducts = await getProductsByCategory(categorySlug, { 
          limit: 20,
          offset: nextPage * 20 - 20
        });
        
        const updatedProducts = [...products, ...newProducts];
        setProducts(updatedProducts);
        setPage(nextPage);
        
        // Reapply sorting to new products
        const sorted = applySorting(updatedProducts, sortBy);
        setSortedProducts(sorted);
      } finally {
        setIsLoadingMore(false);
      }
    });
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && products.length < totalProducts) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoadingMore, products.length, totalProducts]);

  const hasMore = products.length < totalProducts;

  if (initialProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Products in This Category</h3>
        <p className="text-muted-foreground mb-4">
          Check back later for new products
        </p>
        <Button asChild>
          <a href="/">Browse All Products</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {sortedProducts.length} of {totalProducts.toLocaleString()} products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded-sm">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <select 
            className="border border-border rounded-sm px-3 py-1.5 text-sm bg-background"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as SortOption)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
          : 'flex flex-col gap-4'
      }>
        {sortedProducts.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center mt-8 py-4">
          {isLoadingMore && (
            <div className="text-sm text-muted-foreground">
              Loading more products...
            </div>
          )}
        </div>
      )}

      {!hasMore && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Showing all {products.length} products
        </div>
      )}
    </>
  );
}

