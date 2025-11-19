import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <Package className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or is no longer available.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/">Browse Products</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/category/construction">View Categories</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
