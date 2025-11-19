'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    categories: { id: string; name: string; slug: string; count: number }[];
    brands: { id: string; name: string; slug: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}

export function SearchFilters({ filters }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const selectedCategory = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/search?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) {
      params.set('q', query);
    }
    router.push(`/search?${params.toString()}`);
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters = selectedCategory || selectedBrand || minPrice || maxPrice;

  const filterContent = (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-semibold">Active Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      {filters.categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Categories</h3>
          <div className="space-y-2">
            {filters.categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">{category.name}</span>
                <span className="text-xs text-muted-foreground">({category.count})</span>
              </label>
            ))}
            {selectedCategory && (
              <button
                onClick={() => updateFilter('category', null)}
                className="text-xs text-primary hover:underline ml-6"
              >
                Clear category
              </button>
            )}
          </div>
        </div>
      )}

      {/* Brands */}
      {filters.brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Brands</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filters.brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand.id}
                  checked={selectedBrand === brand.id}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">{brand.name}</span>
                <span className="text-xs text-muted-foreground">({brand.count})</span>
              </label>
            ))}
            {selectedBrand && (
              <button
                onClick={() => updateFilter('brand', null)}
                className="text-xs text-primary hover:underline ml-6"
              >
                Clear brand
              </button>
            )}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="minPrice" className="text-xs">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder={`₱${filters.priceRange.min}`}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min={filters.priceRange.min}
              max={filters.priceRange.max}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maxPrice" className="text-xs">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder={`₱${filters.priceRange.max}`}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min={filters.priceRange.min}
              max={filters.priceRange.max}
            />
          </div>
          <Button
            onClick={applyPriceFilter}
            size="sm"
            className="w-full"
          >
            Apply Price Filter
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters {hasActiveFilters && `(${[selectedCategory, selectedBrand, minPrice || maxPrice].filter(Boolean).length})`}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-card border border-border rounded-lg p-6">
        <h2 className="font-bold text-lg mb-6">Filters</h2>
        {filterContent}
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="lg:hidden bg-card border border-border rounded-lg p-6 mb-6">
          {filterContent}
        </div>
      )}
    </>
  );
}
