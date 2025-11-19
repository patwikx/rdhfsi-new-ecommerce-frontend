import { notFound } from 'next/navigation';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getProductsByCategory, getCategoryBySlug } from '@/app/actions/products';
import CategoryProducts from '@/components/products/category-products';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Fetch category and products
  const [category, initialProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug, { limit: 20 }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground mb-4">{category.description}</p>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {category.itemCount} products available
                  </span>
                </div>
                {category.trendPercent && (
                  <Badge variant="outline" className="gap-1">
                    <span className="text-green-600 dark:text-green-400">
                      +{category.trendPercent}%
                    </span>
                    <span className="text-muted-foreground">trending</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <CategoryProducts
          categorySlug={slug}
          initialProducts={initialProducts}
          totalProducts={category.itemCount}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - ProSupply Enterprise`,
    description: category.description || `Browse ${category.itemCount} products in ${category.name} category`,
  };
}
