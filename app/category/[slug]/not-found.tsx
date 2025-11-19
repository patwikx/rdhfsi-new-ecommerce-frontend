import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Package className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-2">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The category you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild size="lg">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}
