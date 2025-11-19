import { Metadata } from 'next';
import { searchProducts, getSearchFilters, getPopularSearches } from '@/lib/actions/search-actions';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchResults } from '@/components/search/search-results';
import { PopularSearches } from '@/components/search/popular-searches';
import { SearchParams } from '@/types/search';

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search: ${query} | RD Hardware` : 'Search Products | RD Hardware',
    description: query 
      ? `Search results for "${query}". Find the best products at RD Hardware.`
      : 'Search for products at RD Hardware. Browse thousands of quality products.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const categoryId = params.category;
  const brandId = params.brand;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = (params.sort as 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular') || 'relevance';
  const page = parseInt(params.page || '1');

  // Fetch search results
  const searchResult = await searchProducts({
    query,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    sortBy: sort,
    page,
    limit: 20,
  });

  // Fetch available filters
  const filtersResult = await getSearchFilters(query);

  // Fetch popular searches if no query
  const popularSearchesResult = !query ? await getPopularSearches(10) : null;

  if (!searchResult.success || !searchResult.data) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchResult.error || 'Failed to load search results'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const results = searchResult.data;
  const filters = filtersResult.success && filtersResult.filters 
    ? filtersResult.filters 
    : { categories: [], brands: [], priceRange: { min: 0, max: 10000 } };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search: "${query}"` : 'Search Products'}
          </h1>
          {!query && (
            <p className="text-muted-foreground">
              Enter a search term to find products
            </p>
          )}
        </div>

        {/* Popular Searches */}
        {!query && popularSearchesResult?.success && popularSearchesResult.searches && (
          <PopularSearches searches={popularSearchesResult.searches} />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters filters={filters} />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchResults results={results} query={query} />
          </div>
        </div>
      </div>
    </div>
  );
}
