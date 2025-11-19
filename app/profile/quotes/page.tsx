import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserQuotes } from '@/lib/actions/quote-actions';
import { QuotesContent } from '@/components/profile/quotes-content';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Quotes | RD Hardware',
  description: 'View and manage your quote requests',
};

export default async function QuotesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirect=/profile/quotes');
  }

  const result = await getUserQuotes();

  if (!result.success) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">My Quotes</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load quotes'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">My Quotes</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage your quote requests
          </p>
        </div>

        {/* Quotes Content */}
        <QuotesContent quotes={result.quotes || []} />
      </div>
    </div>
  );
}
