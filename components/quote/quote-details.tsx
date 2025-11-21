'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { ChevronLeft, MessageSquare, Package } from 'lucide-react';

interface QuoteDetailsProps {
  quote: {
    id: string;
    quoteNumber: string;
    status: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName: string | null;
    message: string | null;
    subtotal: number | null;
    taxAmount: number | null;
    shippingAmount: number | null;
    totalAmount: number | null;
    quotedPrice: number | null;
    adminNotes: string | null;
    validUntil: Date | null;
    respondedAt: Date | null;
    createdAt: Date;
    items: {
      id: string;
      productId: string | null;
      productName: string;
      quantity: number;
      notes: string | null;
      quotedPrice: number | null;
      product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        poPrice: number;
      } | null;
    }[];
  };
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/profile/quotes">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Quotes
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                quote.status
              )}`}
            >
              {quote.status}
            </span>
          </div>
          <p className="text-muted-foreground">
            Requested on {new Date(quote.createdAt).toLocaleDateString()}
          </p>
        </div>

        {quote.quotedPrice && quote.status === 'QUOTED' && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Quoted Price</p>
            <p className="text-3xl font-bold text-primary">
              ₱{formatPrice(quote.quotedPrice)}
            </p>
            {quote.validUntil && (
              <p className="text-xs text-muted-foreground mt-1">
                Valid until {new Date(quote.validUntil).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="border-2 border-border p-6">
            <h2 className="text-xl font-bold mb-4">Requested Items</h2>
            <div className="space-y-3">
              {quote.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    {item.product ? (
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="font-medium">{item.productName}</p>
                    )}
                    {item.product && (
                      <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">Note: {item.notes}</p>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    {item.quotedPrice && (
                      <p className="text-sm text-primary font-bold">
                        ₱{formatPrice(item.quotedPrice)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Response */}
          {quote.adminNotes && (
            <div className="border-2 border-border p-6">
              <h2 className="text-xl font-bold mb-4">Response from RD Hardware</h2>
              <p className="text-sm whitespace-pre-wrap">{quote.adminNotes}</p>
              {quote.respondedAt && (
                <p className="text-xs text-muted-foreground mt-4">
                  Responded on {new Date(quote.respondedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Your Message */}
          {quote.message && (
            <div className="border-2 border-border p-6">
              <h2 className="text-xl font-bold mb-4">Your Message</h2>
              <p className="text-sm whitespace-pre-wrap">{quote.message}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="border-2 border-border p-6">
            <h2 className="text-lg font-bold mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{quote.customerName}</p>
              </div>
              {quote.companyName && (
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{quote.companyName}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{quote.customerEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{quote.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="border-2 border-border p-6">
            <h2 className="text-lg font-bold mb-4">Status</h2>
            <div className="space-y-3 text-sm">
              {quote.status === 'PENDING' && (
                <p className="text-muted-foreground">
                  Your quote request is being reviewed. We&apos;ll get back to you soon.
                </p>
              )}
              {quote.status === 'QUOTED' && (
                <p className="text-muted-foreground">
                  We&apos;ve provided a quote for your request. Please review and contact us to
                  proceed.
                </p>
              )}
              {quote.status === 'ACCEPTED' && (
                <p className="text-green-600">
                  Quote accepted! We&apos;ll process your order shortly.
                </p>
              )}
              {quote.status === 'DECLINED' && (
                <p className="text-red-600">This quote was declined.</p>
              )}
              {quote.status === 'EXPIRED' && (
                <p className="text-muted-foreground">
                  This quote has expired. Please request a new quote.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

