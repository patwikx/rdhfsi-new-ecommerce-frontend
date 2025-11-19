import ProductCard from './product-card';
import { Sparkles } from 'lucide-react';
import type { ProductWithDetails } from '@/app/actions/products';

interface FeaturedProductsProps {
  products: ProductWithDetails[];
  title?: string;
}

export default function FeaturedProducts({ 
  products,
  title = "Featured Products" 
}: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  // Only show first 5 products
  const displayProducts = products.slice(0, 5);

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>
        <p className="text-muted-foreground">
          Discover our handpicked selection of quality products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
