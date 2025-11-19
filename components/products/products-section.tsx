'use client'

import { useState, useTransition, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Grid3x3, List } from 'lucide-react';
import ProductCard from './product-card';
import { Package } from 'lucide-react';
import type { ProductWithDetails, CategoryWithStats } from '@/app/actions/products';
import { getProducts } from '@/app/actions/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsSectionProps {
  initialProducts: ProductWithDetails[];
  totalProducts: number;
  categories: CategoryWithStats[];
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest';
type ViewMode = 'grid' | 'list';

export default function ProductsSection({ 
  initialProducts, 
  totalProducts,
  categories 
}: ProductsSectionProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const applyFiltersAndSort = (
    productsList: ProductWithDetails[], 
    category: string | null, 
    sort: SortOption
  ) => {
    let filtered = [...productsList];

    // Apply category filter
    if (category) {
      filtered = filtered.filter(p => p.category.id === category);
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.retailPrice - b.retailPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      case 'newest':
        // Already sorted by createdAt desc from server
        break;
      case 'relevance':
      default:
        // Keep original order
        break;
    }

    return filtered;
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const filtered = applyFiltersAndSort(products, categoryId, sortBy);
    setFilteredProducts(filtered);
  };

  const handleSort = (sort: SortOption) => {
    setSortBy(sort);
    const filtered = applyFiltersAndSort(products, selectedCategory, sort);
    setFilteredProducts(filtered);
  };

  const loadMore = async () => {
    if (isLoadingMore || products.length >= totalProducts) return;
    
    setIsLoadingMore(true);
    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const newProducts = await getProducts({ 
          limit: 20,
          offset: nextPage * 20 - 20
        });
        
        const updatedProducts = [...products, ...newProducts];
        setProducts(updatedProducts);
        setPage(nextPage);
        
        // Reapply filters to new products
        const filtered = applyFiltersAndSort(updatedProducts, selectedCategory, sortBy);
        setFilteredProducts(filtered);
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
  const displayedCount = filteredProducts.length;

  if (initialProducts.length === 0) {
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
      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">All Products</h3>
            <p className="text-sm text-muted-foreground">
              Showing {displayedCount} of {totalProducts.toLocaleString()} products
              {selectedCategory && ' (filtered)'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
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
          <Select value={sortBy} onValueChange={(value) => handleSort(value as SortOption)}>
            <SelectTrigger className="flex-1 sm:flex-initial min-w-[180px] h-8">
              <SelectValue placeholder="Sort: Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Sort: Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 border border-border rounded-sm bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Filter by Category</h4>
            {selectedCategory && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCategoryFilter(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name} ({category.itemCount})
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {filteredProducts.length > 0 ? (
        <>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'
              : 'flex flex-col gap-4'
          }>
            {filteredProducts.map((product) => (
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
              {selectedCategory && ` (${filteredProducts.length} match your filter)`}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters
          </p>
          <Button onClick={() => handleCategoryFilter(null)}>
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}
