import { Package, BarChart3, Download, Clock } from 'lucide-react';
import { auth } from '@/auth';

export default async function QuickActions() {
  const session = await auth();

  // Only show for logged-in users
  if (!session?.user) {
    return null;
  }

  const quickActions = [
    { icon: Package, label: 'Bulk Orders', desc: 'Volume discounts available' },
    { icon: Download, label: 'Download Catalog', desc: 'PDF & Excel formats' },
    { icon: BarChart3, label: 'Account Dashboard', desc: 'View order history' },
    { icon: Clock, label: 'Quick Reorder', desc: 'From past orders' }
  ];

  return (
    <section className="border-b border-border bg-card">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-3 p-4 rounded-sm border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
