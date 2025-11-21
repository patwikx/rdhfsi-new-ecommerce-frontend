import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { QuotationContent } from '@/components/quotation/quotation-content';

export const metadata: Metadata = {
  title: 'Request for Quotation | RD Hardware',
  description: 'Request a quotation for your selected products',
};

export default function ForQuotationPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Request for Quotation</h1>
          </div>
          <p className="text-muted-foreground">
            Review your items and submit your quotation request
          </p>
        </div>

        {/* Quotation Content */}
        <QuotationContent />
      </div>
    </div>
  );
}
