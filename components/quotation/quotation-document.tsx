'use client';

import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface QuotationItem {
  id: string;
  productName: string;
  quantity: number;
  notes: string | null;
  product: {
    id: string;
    sku: string;
    slug: string;
    poPrice: number;
    images: {
      url: string;
    }[];
  } | null;
}

interface Quotation {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
  items: QuotationItem[];
}

interface QuotationDocumentProps {
  quotation: Quotation;
}

export function QuotationDocument({ quotation }: QuotationDocumentProps) {
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = (): void => {
    window.print();
  };

  const subtotal = quotation.items.reduce((sum, item) => {
    const price = item.product?.poPrice || 0;
    return sum + price * item.quantity;
  }, 0);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'QUOTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'DECLINED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar - Hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 border-b bg-muted/30">
        <div className="mx-auto max-w-[8.5in] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/profile/quotes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quotes
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content - Letter Size */}
      <div className="mx-auto max-w-[8.5in] px-4 py-8 print:max-w-full print:p-0 sm:px-6">
        <div className="quotation-document rounded-lg border bg-white p-12 shadow-sm dark:border-gray-700 dark:bg-gray-900 print:rounded-none print:border-0 print:bg-white print:p-12 print:shadow-none">
          {/* Company Header */}
          <div className="mb-3 border-b-2 border-gray-900 pb-3 text-center dark:border-gray-700 print:border-black">
            <h1 className="mb-3 whitespace-nowrap text-3xl font-bold text-gray-900 dark:text-white print:text-black">
              RD HARDWARE & FISHING SUPPLY, INC.
            </h1>
            <p className="mb-1 text-sm text-gray-700 dark:text-gray-300 print:text-black">
              Santiago Boulevard, General Santos City, Philippines, 9500
            </p>
            <p className="mb-1 text-sm text-gray-700 dark:text-gray-300 print:text-black">
              Phone: 0939 912 4032 | Email: rdh_santiago@rdretailgroup.com.ph
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
              Business Hours: Monday - Sunday, 8:00 AM - 5:00 PM
            </p>
          </div>

          {/* Document Title and Status */}
          <div className="mb-3 flex items-start justify-between border-b border-gray-900 pb-3 dark:border-gray-700 print:border-black">
            <div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white print:text-black">
                REQUEST FOR QUOTATION
              </h2>
              <div className="space-y-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
                  <span className="font-semibold">Quotation Number:</span>{' '}
                  {quotation.quoteNumber}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
                  <span className="font-semibold">Date Issued:</span>{' '}
                  {formatDate(quotation.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block rounded border-2 px-4 py-2 text-sm font-semibold print:border-black print:bg-white print:text-black ${getStatusColor(quotation.status)}`}
              >
                {quotation.status}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-white print:text-black">
              Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-sm">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">
                  Name:{' '}
                </span>
                <span className="text-gray-900 dark:text-white print:text-black">
                  {quotation.customerName}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">
                  Email:{' '}
                </span>
                <span className="text-gray-900 dark:text-white print:text-black">
                  {quotation.customerEmail}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">
                  Phone:{' '}
                </span>
                <span className="text-gray-900 dark:text-white print:text-black">
                  {quotation.customerPhone}
                </span>
              </div>
              {quotation.companyName && (
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white print:text-black">
                    Company:{' '}
                  </span>
                  <span className="text-gray-900 dark:text-white print:text-black">
                    {quotation.companyName}
                  </span>
                </div>
              )}
            </div>
            {quotation.message && (
              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white print:text-black">
                  Message / Requirements:{' '}
                  <span className="font-normal">{quotation.message}</span>
                </p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-white print:text-black">
              Requested Items
            </h2>
            <table className="w-full border-2 border-gray-900 dark:border-gray-700 print:border-black">
              <thead className="bg-gray-200 dark:bg-gray-800 print:bg-white">
                <tr>
                  <th className="border-b-2 border-gray-900 px-3 py-2 text-left font-bold text-gray-900 dark:border-gray-700 dark:text-white print:border-black print:text-black">
                    Item
                  </th>
                  <th className="border-b-2 border-gray-900 px-3 py-2 text-center font-bold text-gray-900 dark:border-gray-700 dark:text-white print:border-black print:text-black">
                    SKU
                  </th>
                  <th className="border-b-2 border-gray-900 px-3 py-2 text-center font-bold text-gray-900 dark:border-gray-700 dark:text-white print:border-black print:text-black">
                    Qty
                  </th>
                  <th className="border-b-2 border-gray-900 px-3 py-2 text-right font-bold text-gray-900 dark:border-gray-700 dark:text-white print:border-black print:text-black">
                    Unit Price
                  </th>
                  <th className="border-b-2 border-gray-900 px-3 py-2 text-right font-bold text-gray-900 dark:border-gray-700 dark:text-white print:border-black print:text-black">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 print:bg-white">
                {quotation.items.map((item, index) => {
                  const price = item.product?.poPrice || 0;
                  const amount = price * item.quantity;

                  return (
                    <tr
                      key={item.id}
                      className={
                        index !== quotation.items.length - 1
                          ? 'border-b border-gray-900 dark:border-gray-700 print:border-black'
                          : ''
                      }
                    >
                      <td className="px-3 py-2 text-gray-900 dark:text-white print:text-black">
                        <div className="font-medium">{item.productName}</div>
                        {item.notes && (
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 print:text-gray-700">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900 dark:text-white print:text-black">
                        {item.product?.sku || 'N/A'}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-900 dark:text-white print:text-black">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-900 dark:text-white print:text-black">
                        ₱{formatPrice(price)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white print:text-black">
                        ₱{formatPrice(amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-gray-900 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 print:border-black print:bg-white">
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-2 text-right text-base font-bold text-gray-900 dark:text-white print:text-black"
                  >
                    ESTIMATED TOTAL:
                  </td>
                  <td className="px-3 py-2 text-right text-lg font-bold text-gray-900 dark:text-white print:text-black">
                    ₱{formatPrice(subtotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes */}
          <div className="space-y-4 border-t-2 border-gray-900 pt-6 dark:border-gray-700 print:border-black">
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/20 print:border-black print:border-l-0 print:bg-white print:p-0">
              <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white print:text-black">
                IMPORTANT NOTES:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-800 dark:text-gray-300 print:text-black">
                <li>
                  This is a request for quotation. Prices shown are estimates
                  and subject to change.
                </li>
                <li>
                  Final pricing will be provided by our sales team within 1-2
                  business days.
                </li>
                <li>
                  Quotation validity is subject to stock availability and market
                  conditions.
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
              <p className="mb-1 font-semibold">
                For inquiries or clarifications:
              </p>
              <p>Phone: 0939 912 4032 | Email: rdh_santiago@rdretailgroup.com.ph</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-900 pt-6 text-center dark:border-gray-700 print:border-black">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white print:text-black">
              Thank you for your interest in RD Hardware & Fishing Supply, Inc.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 print:text-gray-700">
              Document generated on {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
