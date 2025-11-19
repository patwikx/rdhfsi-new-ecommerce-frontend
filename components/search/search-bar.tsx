'use client'

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { searchProducts } from '@/app/actions/products';
import type { ProductWithDetails } from '@/app/actions/products';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductWithDetails[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const searchResults = await searchProducts(searchQuery);
      setResults(searchResults);
      setIsOpen(true);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 max-w-2xl relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-sm border border-border focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search products by name, SKU, or category..." 
          className="bg-transparent border-none outline-none text-sm flex-1"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Button type="submit" size="sm" className="h-7" disabled={isPending || !query.trim()}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-sm shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-2 py-1">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex items-center gap-3 p-2 hover:bg-muted rounded-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-12 h-12 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku} • {product.category.name}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">₱{formatPrice(product.retailPrice)}</p>
                  {product.inventories.length > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {product.inventories.reduce((sum, inv) => sum + inv.availableQty, 0)} in stock
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && !isPending && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-sm shadow-lg p-4 z-50">
          <p className="text-sm text-muted-foreground text-center">
            No products found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
