'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { MessageSquare, ChevronRight } from 'lucide-react';

interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string | null;
  message: string | null;
  subtotal: number | null;
  totalAmount: number | null;
  quotedPrice: number | null;
  validUntil: Date | null;
  createdAt: Date;
  items: {
    id: string;
    productName: string;
    quantity: number;
    quotedPrice: number | null;
  }[];
}

interface QuotesContentProps {
  quotes: Quote[];
}

export function QuotesContent({ quotes }: QuotesContentProps) {
  const [filter, setFilter] = useState<string>('all');

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'QUOTED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'DECLINED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredQuotes =
    filter === 'all' ? quotes : quotes.filter((q) => q.status === filter);

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border">
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Request a quote for bulk orders or custom pricing
        </p>
        <Button asChild>
          <Link href="/for-quotation">Request Quote</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({quotes.length})
        </Button>
        <Button
          variant={filter === 'PENDING' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('PENDING')}
        >
          Pending ({quotes.filter((q) => q.status === 'PENDING').length})
        </Button>
        <Button
          variant={filter === 'QUOTED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('QUOTED')}
        >
          Quoted ({quotes.filter((q) => q.status === 'QUOTED').length})
        </Button>
        <Button
          variant={filter === 'ACCEPTED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('ACCEPTED')}
        >
          Accepted ({quotes.filter((q) => q.status === 'ACCEPTED').length})
        </Button>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredQuotes.map((quote) => (
          <Link
            key={quote.id}
            href={`/quote/${quote.id}`}
            className="group block border-2 border-border p-4 hover:border-primary transition-all hover:shadow-md cursor-pointer"
          >
            <div className="flex flex-col h-full">
              {/* Quote Number & Status */}
              <div className="mb-3">
                <h3 className="font-bold text-sm mb-2 truncate">{quote.quoteNumber}</h3>
                <span
                  className={`inline-block text-[10px] font-medium px-2 py-1 rounded-full ${getStatusColor(
                    quote.status
                  )}`}
                >
                  {quote.status}
                </span>
              </div>

              {/* Quote Details */}
              <div className="space-y-2 text-xs mb-4 flex-1">
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">{quote.items.length}</span> {quote.items.length === 1 ? 'item' : 'items'}
                </div>
                <div className="text-muted-foreground truncate">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </div>
                {quote.validUntil && (
                  <div className="text-muted-foreground text-[10px] truncate">
                    Valid: {new Date(quote.validUntil).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Quoted Price */}
              {quote.quotedPrice ? (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Quoted Price</p>
                  <p className="text-lg font-bold">₱{formatPrice(quote.quotedPrice)}</p>
                </div>
              ) : (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Awaiting quote</p>
                </div>
              )}

              {/* View Arrow */}
              <div className="flex justify-end mt-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border">
          <p className="text-muted-foreground">No quotes found with this status</p>
        </div>
      )}
    </div>
  );
}
