import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuotationById } from '@/lib/actions/quotation-actions';
import { QuotationDocument } from '@/components/quotation/quotation-document';

interface QuotationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: QuotationPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getQuotationById(id);

  if (!result.success || !result.quotation) {
    return {
      title: 'Quotation Not Found',
    };
  }

  return {
    title: `Quotation ${result.quotation.quoteNumber} | RD Hardware`,
    description: `View your quotation request ${result.quotation.quoteNumber}`,
  };
}

export default async function QuotationPage({ params }: QuotationPageProps) {
  const { id } = await params;
  const result = await getQuotationById(id);

  if (!result.success || !result.quotation) {
    notFound();
  }

  return <QuotationDocument quotation={result.quotation} />;
}
