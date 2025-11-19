'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCollectionPageProps {
  title: string;
  description: string;
  products: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string | null;
    retailPrice: number;
    compareAtPrice: number | null;
    isOnSale: boolean;
    isFeatured: boolean;
    averageRating: number | null;
    reviewCount: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    brand: {
      id: string;
      name: string;
      slug: string;
    } | null;
    images: {
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }[];
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  basePath: string;
}

export function ProductCollectionPage({
  title,
  description,
  products,
  totalCount,
  totalPages,
  currentPage,
  basePath,
}: ProductCollectionPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1');
    router.push(`${basePath}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${basePath}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <Button onClick={() => router.push('/')}>Browse All Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              barcode: '',
              bulkPrice: null,
              moq: 1,
              leadTime: null,
              inventories: [],
            } as import('@/app/actions/products').ProductWithDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      <p className="text-center text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
