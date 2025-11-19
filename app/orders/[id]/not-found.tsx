import Link from 'next/link';
import { Package } from 'lucide-react';

export default function OrderNotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
