import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getQuoteById } from '@/lib/actions/quote-actions';
import { QuoteDetails } from '@/components/quote/quote-details';

export const metadata: Metadata = {
  title: 'Quote Details | RD Hardware',
  description: 'View your quote request details',
};

interface QuotePageProps {
  params: Promise<{ id: string }>;
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirect=/quote/' + id);
  }

  const result = await getQuoteById(id);

  if (!result.success || !result.quote) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <QuoteDetails quote={result.quote} />
      </div>
    </div>
  );
}
