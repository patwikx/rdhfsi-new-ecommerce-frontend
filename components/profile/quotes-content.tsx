'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Request a quote for bulk orders or custom pricing
        </p>
        <Button asChild>
          <Link href="/bulk-order">Request Quote</Link>
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

      {/* Quotes List */}
      <div className="space-y-3">
        {filteredQuotes.map((quote) => (
          <Link key={quote.id} href={`/quote/${quote.id}`}>
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{quote.quoteNumber}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Items:</span>{' '}
                      <span className="font-medium">{quote.items.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {quote.validUntil && (
                      <div>
                        <span className="text-muted-foreground">Valid Until:</span>{' '}
                        <span className="font-medium">
                          {new Date(quote.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {quote.quotedPrice && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Quoted Price</p>
                      <p className="text-xl font-bold">₱{formatPrice(quote.quotedPrice)}</p>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No quotes found with this status</p>
        </div>
      )}
    </div>
  );
}
