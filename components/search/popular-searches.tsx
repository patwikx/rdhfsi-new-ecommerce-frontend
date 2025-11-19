import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

interface PopularSearchesProps {
  searches: string[];
}

export function PopularSearches({ searches }: PopularSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Popular Searches</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <Link
            key={search}
            href={`/search?q=${encodeURIComponent(search)}`}
            className="px-3 py-1.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full text-sm transition-colors"
          >
            {search}
          </Link>
        ))}
      </div>
    </div>
  );
}
