import Link from 'next/link';
import { Package, Star } from 'lucide-react';
import { getRelatedProducts } from '@/lib/actions/related-products-actions';

interface RelatedProductsProps {
  productId: string;
}

export async function RelatedProducts({ productId }: RelatedProductsProps) {
  const result = await getRelatedProducts(productId, 6);

  if (!result.success || result.products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {result.products.map((product) => {
          const primaryImage = product.images?.[0];
          const rating = product.averageRating ? Number(product.averageRating) : 0;
          const reviewCount = product.reviewCount || 0;
          
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all bg-card"
            >
              <div className="aspect-square relative mb-3 bg-muted rounded overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1 font-mono">{product.sku}</p>
              
              {/* Star Rating - Always show */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(rating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {reviewCount > 0 ? `(${reviewCount})` : '(0)'}
                </span>
              </div>
              
              <p className="text-lg font-bold">
                ₱{Number(product.poPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

