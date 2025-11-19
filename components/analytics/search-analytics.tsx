import { TrendingUp, Search, Eye } from 'lucide-react';

interface SearchAnalyticsProps {
  popularSearches: { query: string; count: number }[];
  trendingProducts: { productId: string; productName: string; viewCount: number }[];
}

export function SearchAnalytics({ popularSearches, trendingProducts }: SearchAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Popular Searches */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Popular Searches</h3>
        </div>
        {popularSearches.length > 0 ? (
          <div className="space-y-3">
            {popularSearches.map((search, index) => (
              <div key={search.query} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <span className="text-sm">{search.query}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{search.count} searches</span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(search.count / popularSearches[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No search data available yet</p>
        )}
      </div>

      {/* Trending Products */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Trending Products (Last 7 Days)</h3>
        </div>
        {trendingProducts.length > 0 ? (
          <div className="space-y-3">
            {trendingProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <span className="text-sm truncate max-w-[200px]">{product.productName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{product.viewCount} views</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No product view data available yet</p>
        )}
      </div>
    </div>
  );
}
