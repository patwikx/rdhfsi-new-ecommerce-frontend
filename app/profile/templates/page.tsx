import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserTemplates } from '@/lib/actions/template-actions';
import { TemplatesContent } from '@/components/profile/templates-content';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reorder Templates | RD Hardware',
  description: 'Manage your reorder templates for quick ordering',
};

export default async function TemplatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirect=/profile/templates');
  }

  const result = await getUserTemplates();

  if (!result.success) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">Reorder Templates</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load templates'}</p>
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
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Reorder Templates</h1>
          </div>
          <p className="text-muted-foreground">
            Save your frequently ordered items for quick reordering
          </p>
        </div>

        {/* Templates Content */}
        <TemplatesContent templates={result.templates || []} />
      </div>
    </div>
  );
}
